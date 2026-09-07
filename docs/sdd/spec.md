# Handwerker Booking Pro — Spec

## Product / Business Goals

A booking platform connecting customers with local handworkers (Handwerker) in the Kassel + Göttingen region (up to 50 km radius). Customers find a master by category, view services, and book a time slot. Masters manage their profile, services, schedule, and approve or decline bookings.

- Region: Kassel and Göttingen, maximum 50 km from those cities (haversine filter on master location).
- Language: German (primary) + English (secondary).
- Monetization: free booking for MVP (no payments). Booking creates a request; master approves.

## Personas & Roles

| Role | Capabilities |
|------|--------------|
| **Guest** | Browse masters, view services, request a booking (provides contact info). |
| **Customer (Client)** | Register/login, browse, book, view/manage own bookings. |
| **Master (Handwerker)** | Create profile, add services, set fixed working hours, approve/decline bookings, dashboard. |
| **Admin** | Approve/reject new master registrations, moderate content, deactivate masters. |

## User Stories

- As a guest/customer, I can search masters by category (trade) and city/radius and see only those within the Kassel+Göttingen 50 km zone.
- As a customer, I can view a master's profile, services, prices, availability, and request a booking for a specific service on an available slot.
- As a customer, I can see my bookings and their status (pending/confirmed/declined/cancelled).
- As a master, I can create and edit my profile with location (city/PLZ), trade, bio, and portfolio photos.
- As a master, I can add services (name, price, duration).
- As a master, I can set my working hours which auto-generate bookable slots.
- As a master, I can approve or decline pending booking requests.
- As an admin, I can approve or reject new master registrations before they become visible.
- As an admin, I can deactivate a master.

## Functional Requirements

### FR-1 — Auth & Roles
Registration and login with role selection. Customers register directly. Masters register but are **inactive until approved by admin**. Admin account exists (seeded).

### FR-2 — Geo / Region Filter
Master profile stores `latitude`, `longitude` (or derived from PLZ). Search filters masters by category and by distance → only those within 50 km of Kassel or Göttingen. Use haversine formula. A master within range of either city is shown.

### FR-3 — Master Profile
CRUD profile: name, trade/category, city, PLZ, bio, phone, portfolio images (Supabase Storage). Only owner (or admin) can edit.

### FR-4 — Services
Master adds services: name, price, duration_minutes. Belong to one master.

### FR-5 — Working Hours & Slot Generation
Master defines fixed weekly working hours (e.g. Mon–Fri 09:00–17:00). Slots are generated from working hours minus service duration, skipping overlaps with existing bookings / blocked times.

### FR-6 — Booking
Customer selects service + a generated available slot → creates booking request with status `pending`. Booking bounded by service duration; must not overlap an existing confirmed booking (transactional, conflict-checked).

### FR-7 — Master Dashboard
Master sees own bookings, can confirm (`confirmed`) or decline (`declined`). Declined/cancelled slots become available again.

### FR-8 — Customer Dashboard
Customer sees own bookings and status; can cancel (`cancelled`).

### FR-9 — Admin Panel
Admin sees list of pending master registrations, approve (`active`) or reject. Can deactivate active masters.

### FR-10 — i18n
German default, English secondary. Language toggle.

### FR-11 — Legal (DE)
Impressum, Datenschutzerklärung, cookie consent. Required for German market.

### FR-12 — Design
Unique, trustworthy, mobile-first UI with clear "Jetzt buchen" CTAs. Built with design skills (frontend-design) to avoid AI-generic look.

## Non-Functional Requirements

- Responsive, mobile-first. Primary interaction often on phone.
- Security: Row Level Security (RLS) on all tables; role checks in middleware + RLS policies.
- Conflict-free bookings via transaction and unique constraint.
- Fast queries: index on `profiles.location`, `services.category`, `bookings.master_id`, `bookings.customer_id`.
- GDPR: user-visible legal pages, consent where applicable.

## Out of Scope (MVP)

- Payments (no Stripe in phase 1).
- Notifications via Telegram/SMS (email later).
- Reviews/ratings (later phase).
- Complex calendar recurring exceptions (blocked_times in v1, exceptions later).

## Acceptance Criteria (sample)

- AC-1: A master in Göttingen is shown when searching from Kassel if ≤50 km; a master >50 km away from both cities is not shown.
- AC-2: Two customers cannot book the same slot for the same master simultaneously.
- AC-3: A customer cannot edit another master's profile (RLS + role check).
- AC-4: A registration for a master outside the region is rejected or marked out-of-zone.
- AC-5: A pending booking does not block a slot from another booking request (only confirmed booking blocks).
- AC-6: Legal pages (Impressum, Datenschutz) are reachable in DE and EN.
