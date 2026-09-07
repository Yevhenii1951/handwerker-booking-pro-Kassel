📄 docs/sdd/spec.md — спецификация

- 3 роли (кустomer, master, admin)
- Мастер неактивен до одобрения админом
- Гео: Kassel + Göttingen, ≤50 км (гаверсинус)
- Мастер задаёт фиксированные рабочие часы → авто-генерация слотов
- Бронирование = запрос, мастер подтверждает
- Без оплат (MVP), DE + EN, email-уведомления
- 12 функциональных требований + acceptance criteria
  📄 docs/sdd/schema.sql — схема БД для Supabase
  Таблицы: profiles, portfolio_images, services, working_hours, blocked_times, bookings, region_centers
  Ключевые решения:
- Без двойного бронирования: уникальный partial index uq_confirmed_slot (master_id, start_at) WHERE status='confirmed' — только подтверждённые брони блокируют слот
- RLS на все таблицы: публично видны только активные мастера; свой профиль/заказы — владелец; мастер меняет свои услуги; админ — всё
- region_centers с координатами Касселя и Гёттингена (радиус 50 км)

✅ Базовая инфраструктура проекта
Файл Назначение
src/lib/supabase/client.ts Браузерный Supabase-клиент
src/lib/supabase/server.ts Серверный клиент (для Server Components)
src/lib/supabase/middleware.ts Обновление сессии в middleware
src/middleware.ts Корневой middleware (глобальная сессия)
src/lib/geo.ts Гаверсинус-расчёт + проверка зоны (Kassel/Göttingen, ≤50 км)
src/lib/slots.ts Генерация слотов + проверка пересечений
src/types/database.ts Все типы БД (Profile, Service, Booking, WorkingHours...)
src/lib/utils.ts cn() через clsx + tailwind-merge
✅ Структура app/ (route groups)
src/app/
├── (marketing)/ # Публичный сайт
│ └── page.tsx # Лендинг
├── (auth)/ # login, register
├── (dashboard)/ # master/, customer/
├── legal/ # impressum, datenschutz
├── api/auth/callback/ # Supabase OAuth callback
├── layout.tsx # DE по умолчанию, toaster
✅ Проверки

- tsc --noEmit — чистый ✅
- npm run lint — чистый ✅
- next build — успешен ✅
  Build показал, что middleware автоматически работает как Proxy (Next 16.3 новая фича), предупреждение о кodemod не критично для dev.
  📌 Твои 2 шага

1. Запусти SQL: Supabase → SQL Editor → вставь содержимое docs/sdd/schema.sql → Run
2. Скопируй после этого docs/sdd/spec.md не забыл — но код уже по ней строится.

Отлично. Реализую T1 Auth. Сначала посмотрю, что нужно: файлы auth-страниц, middleware-защита, типизированные роли.
Проверю текущее состояние callback пустая и что на dashboard:
→Read 1_FullStack/1_DEVELOPMENT_SDD/06_PROJECTS/003_handwerker-booking-pro-Kassel/web/src/app/(marketing)/page.tsx
→Read 1_FullStack/1_DEVELOPMENT_SDD/06_PROJECTS/003_handwerker-booking-pro-Kassel/web/src/components/ui/form.tsx
Форма form.tsx не установлена. Нужна для форм. Но сначала сделаю auth без сложных форм — использую простые client-компоненты с useState. Создам:

1. Auth helper-функции
2. Страницы login/register
3. Dashboard защищённый layout
4. DB trigger для авто-создания профиля при регистрации
   Начну с helpers:

Теперь регистрация. Создам страницу с простой формой (без React Hook Form — хватит useState + zod валидация):

Теперь login страница + форма:

Теперь нужен DB trigger для авто-создания профиля при регистрации + redirect с /dashboard на роль-специфичный. Также добавлю в schema SQL trigger. Сначала создам trigger SQL и вставлю позже пользователю. Но чтобы работало сразу — создам trigger сейчас через код + страницу /dashboard редиректор:

Теперь dashboard лейауты. Создам простой защищённый layout с выходом:

Теперь placeholder-страницы для master и customer дашбордов:

Теперь создам SQL trigger для авто-создания профиля при регистрации. Это критично — без него профиль не создаётся. Добавлю в schema.sql и дам тебе выполнить отдельно:
→Read 1_FullStack/1_DEVELOPMENT_SDD/06_PROJECTS/003_handwerker-booking-pro-Kassel/docs/sdd/schema.sql [offset=1, limit=40]

Добавлю trigger в конец schema.sql:

Теперь отдельный файл с триггером — чтобы ты применил только его (основная схема уже отработала):

# Wrote 1_FullStack/1_DEVELOPMENT_SDD/06_PROJECTS/003_handwerker-booking-pro-Kassel/docs/sdd/trigger_profile.sql

Теперь добавлю страницу перехода с callback (для email confirmation):

# Wrote 1_FullStack/1_DEVELOPMENT_SDD/06_PROJECTS/003_handwerker-booking-pro-Kassel/web/src/app/api/auth/callback/route.ts

Теперь проверю типы и билд. Также dashboard requires email confirmation — но лучше включить "Email confirmations" в Supabase. Проверю сборку:

✅ T1 Auth — готово
Создано:
Файл Что делает
src/lib/auth.ts getCurrentUser, getCurrentProfile, requireUser, requireProfile, requireRole
(auth)/register/ Страница + форма регистрации с выбором роли (Kunde/Handwerker)
(auth)/login/ Страница + форма входа
dashboard/ Лейаут с защитой + кнопка "Abmelden" + роутер по роли
dashboard/master/ Заглушка (показывает "pending" если мастер на модерации)
dashboard/customer/ Заглушка
api/auth/callback/ Обработка подтверждения email
docs/sdd/trigger_profile.sql SQL-триггер — создаёт профиль при регистрации
Исправлено:

- Route-группа (dashboard) → папка dashboard/ (убрал конфликт путей /)
- middleware.ts → proxy.ts (новая конвенция Next 16.3)
- utils.ts → чистый cn() (clsx + tailwind-merge), не трогает shadcn
  Проверки:
- ✅ tsc --noEmit — чисто
- ✅ npm run lint — чисто
- ✅ next build — успешен, маршруты: /, /login, /register, /dashboard\*, /api/auth/callback
  📌 Твой шаг — запусти trigger
  Открой docs/sdd/trigger_profile.sql → вставь в Supabase SQL Editor → Run.
  Это критично: без него при регистрации не создастся строка в profiles, и тебя будет кидать обратно на /login.
  После этого — тест в браузере

1. npm run dev → открой localhost:3000/register
2. Зарегистрируйся как Kunde → должен попасть в /dashboard/customer
3. Зарегистрируйся как Handwerker → попадёт в /dashboard/master с надписью "Antrag in Prüfung"
   Скажи когда запустил trigger — и как прошёл тест. Затем перейдём к T2 (гео-проверка мастеров).

Готово — коммит и пуш выполнены.

Итог

- Коммит: feat: SDD spec, Supabase schema, and auth foundation (50 файлов)
- Ветка: main, отслеживает origin/main
- На GitHub: https://github.com/Yevhenii1951/handwerker-booking-pro-Kassel
  Безопасность: .env.local (с твоими ключами Supabase) исключён и не попал в репозиторий. ✅
  Следующий шаг — запусти trigger_profile.sql в Supabase SQL Editor (я его уже создал в docs/sdd/trigger_profile.sql), и протестируй регистрацию. Скажи как получится.

✅ Всё работает. Тестовые юзеры удалены.
Итог
Сценарий Результат
Мастер, роль master профиль создан, master_status: pending ✅
Клиент, роль customer профиль создан, master_status: null ✅
Баг был в типе: CASE ... THEN 'pending' возвращал text, а вставлялся в enum-колонку master_status. Явный каст 'pending'::public.master_status это исправил.
Что дальше
Теперь регистрация в твоём приложении (npm run dev → /register) должна работать как надо.
Фикс записан в docs/sdd/trigger_profile.sql и docs/sdd/schema.sql. Сделать коммит и пуш? И переходим к T2 — гео-проверка мастеров (реализация подробностей профиля мастера с координатами/регионом)?
=================================================================================================

✅ T2 готово и запушено (31e8729).
Что сделано
Файл Назначение
src/lib/geocode.ts Геокодинг PLZ → координаты через Nominatim (OpenStreetMap, без ключа)
src/lib/geo.ts + regionFromCenters() — определение ближайшей зоны (Kassel/Göttingen)
src/lib/trades.ts Список Gewerke для выбора
dashboard/master/onboarding/ Страница + форма + server action с проверкой зоны 50 км
dashboard/master/page.tsx Редирект на онбординг, пока профиль не заполнен
vitest + тесты 13 тестов: haversine, зона, геокодер (фолбэки, ошибки)
Как работает

1. Мастер регистрируется → /dashboard/master → редирект на онбординг
2. Заполняет Gewerk, PLZ, Ort, телефон → Submit
3. Сервер геокодит PLZ → проверяет isWithinAnyRegion (50 км от Kassel или Göttingen)
4. В зоне → профиль сохранён + координаты, статус остаётся pending (ждёт админа)
5. Вне зоны → ошибка «liegt außerhalb unseres Servicegebiets», данные не сохраняются
   Проверки: tsc ✅ · lint ✅ · test 13/13 ✅ · build ✅
   Твой шаг (когда лимит сбросится)
   Регистрация мастера → заполнить онбординг (например PLZ 34117 Kassel). Если ввести PLZ далеко (напр. 10115 Berlin) — увидишь отказ.
   Проверь — и переходим к T3: профиль мастера (CRUD, услуги, рабочие часы → генерация слотов).
