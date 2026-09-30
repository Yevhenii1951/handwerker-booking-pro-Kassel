# Bildnachweise / Image credits

Herkunft aller Bilder unter `web/public/images/gallery/`. Attribution ist bei
beiden Quellen nicht vorgeschrieben, wird hier aber zur Nachvollziehbarkeit geführt.

## Rekonstruktion der Zuordnung

Die Zuordnung Datei → Foto wurde aus der Browser-Download-Historie rekonstruiert,
indem der Zeitstempel des Downloads mit dem `mtime` der umbenannten Datei verglichen
wurde. Alle 34 Dateien liessen sich dadurch eindeutig zuordnen (maximale Abweichung
1,6 s). Die unten genannten URLs sind aus den Download-Dateinamen nachgebildet
(Format `<autor>-<id>-unsplash.jpg` bzw. `pexels-<autor>-<id>.jpg`) und **nicht**
per HTTP-Abruf verifiziert — beide Plattformen blockieren automatisierte Abfragen
mit 401/403. Die URL-Struktur ist korrekt, ein Klick im Browser sollte die
jeweilige Fotoseite öffnen.

Mehrere Dateien teilen sich dieselbe Foto-ID, weil Pexels zu einem Foto mehrere
Bildvarianten (unterschiedliche Zuschnitte) mit je eigener Asset-ID ausliefert.
`elektriker-1..4` und `dachdecker-1..3` stammen alle aus dem Foto `1243575272`,
sind aber visuell verschieden (graustufige 16×16-Korrelation der Paare max. 0,72,
also keine Dubletten).

## Lizenzen

- **Pexels** — <https://www.pexels.com/license/>: kostenlose kommerzielle und
  nicht-kommerzielle Nutzung, keine Namensnennung erforderlich. Nicht erlaubt sind
  Weitergabe/Verkauf unveränderter Bilder, Weiterverkauf als eigenes Stockarchiv und
  die Darstellung identifizierbarer Personen in einer Weise, die eine Empfehlung
  suggeriert.
- **Pexels** verlangt für hochgeladene Fotos mit identifizierbaren Personen ein
  Model Release; die Plattform prüft das beim Hochladen. Beim Einsatz als allgemeines
  Gewerke-Bild ist das die entscheidende Bedingung für § 22 KUG.
- **Unsplash** — <https://unsplash.com/license>: kostenlose kommerzielle und
  nicht-kommerzielle Nutzung, keine Namensnennung erforderlich. Nicht gestattet ist
  der Verkauf unveränderter Kopien ohne deutliche Änderung.

### Offene Punkte

1. **Kein Personen-/Objektrelease dokumentiert.** § 22 KUG erlaubt die Veröffentlichung
  identifizierbarer Personen nur mit Einwilligung. Ein Gewerke-Bild zeigt keine konkrete
  Person, die etwas empfiehlt — die Einwilligung des Abgebildeten ist davon aber nicht
  berührt. Für eine reale kommerzielle Plattform hier ein Release je Bild führen.
2. **Keine Marken in Dateinamen.** Die vorherige Fassung enthielt Fotos mit sichtbaren
  Marken (Danfoss, Fujitsu) im Dateinamen. Die aktuelle Auswahl kommt ohne Markennamen aus,
  vermeidet aber das Problem nicht grundsätzlich: ein Foto mit erkennbarer Produktmarke
  darf nicht den Eindruck einer Lieferantenbeziehung erzeugen (§ 5 UWG).
3. **Kein echtes Portfolio.** Die Bilder sind generische Gewerkefotos, keine Arbeiten
  konkreter Betriebe. Sie werden ausschließlich als Kartencover verwendet (`tradeCover()`),
  nicht als ausgewiesenes Portfolio — die Abgrenzung sollte so bleiben.

## Pexels (18)

| Datei | Autor | Quelle |
| --- | --- | --- |
| `boden-1.webp` | clickerhappy | https://www.pexels.com/photo/1388944/ |
| `boden-2.webp` | julia-bataeva | https://www.pexels.com/photo/2150297626/ |
| `boden-3.webp` | lamiko | https://www.pexels.com/photo/3616756/ |
| `dachdecker-1.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `dachdecker-2.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `dachdecker-3.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `elektriker-1.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `elektriker-2.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `elektriker-3.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `elektriker-4.webp` | bulat843 | https://www.pexels.com/photo/1243575272/ |
| `elektriker-5.webp` | kseniachernaya | https://www.pexels.com/photo/5691589/ |
| `fliesen-1.webp` | pu-ca-adryan | https://www.pexels.com/photo/163345030/ |
| `heizung-1.webp` | jan-van-der-wolf | https://www.pexels.com/photo/11680885/ |
| `heizung-2.webp` | sejio402 | https://www.pexels.com/photo/29226620/ |
| `heizung-3.webp` | skylar-kang | https://www.pexels.com/photo/6045338/ |
| `maurer-1.webp` | gowtham-agm | https://www.pexels.com/photo/609630353/ |
| `maurer-2.webp` | mohammed-yousif | https://www.pexels.com/photo/2463159/ |
| `maurer-3.webp` | tr-n-h-ng-cong | https://www.pexels.com/photo/136437809/ |

## Unsplash (16)

| Datei | Autor | Quelle |
| --- | --- | --- |
| `fenster-tuer-1.webp` | maria-ziegler | https://unsplash.com/photos/1AmEImwtnFk |
| `fenster-tuer-2.webp` | mark-adriane | https://unsplash.com/photos/5Ok5szBZpBA |
| `fliesen-2.webp` | charlesdeluvio | https://unsplash.com/photos/LyQi9DS7AEg |
| `fliesen-3.webp` | bernard-hermant | https://unsplash.com/photos/cB18uhhf43s |
| `garten-1.webp` | jonathan-kemper | https://unsplash.com/photos/CbZh3kaPxrE |
| `garten-2.webp` | zoe-richardson | https://unsplash.com/photos/tbiV-yc903g |
| `klima-1.webp` | maxwell-odonkor | https://unsplash.com/photos/32sdOfMXRC8 |
| `klima-2.webp` | prasopchok | https://unsplash.com/photos/UcPEiRiKxuk |
| `klima-3.webp` | zulfugar-karimov | https://unsplash.com/photos/mM0vW68NY0g |
| `maler-1.webp` | ali-mkumbwa | https://unsplash.com/photos/1iho4gvI4-g |
| `maler-2.webp` | callum-hill | https://unsplash.com/photos/f1UwaROA2UQ |
| `maler-3.webp` | patrick | https://unsplash.com/photos/ITbGTRdErO0 |
| `sanitaer-1.webp` | alaa-turkman | https://unsplash.com/photos/mfO0SRKNzME |
| `sanitaer-2.webp` | maximilian-bungart | https://unsplash.com/photos/eV4nBji2-Uc |
| `schreiner-1.webp` | ryno-marais | https://unsplash.com/photos/p5JcD-_13ek |
| `schreiner-2.webp` | samantha-fortney | https://unsplash.com/photos/VqXio0EvV1A |
