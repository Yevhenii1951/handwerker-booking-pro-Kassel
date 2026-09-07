import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 20 fake masters. Cities within 50 km of Kassel (51.3127,9.4797)
// or Göttingen (51.5413,9.9157).
const MASTERS = [
  { name: "Elektro Fischer GmbH", trade: "Elektriker", city: "Kassel", plz: "34117" },
  { name: "Sanitär Hoffmann", trade: "Klempner / Installateur (Sanitär, Heizung)", city: "Baunatal", plz: "34225" },
  { name: "Malerbetrieb Weber", trade: "Maler / Lackierer", city: "Göttingen", plz: "37073" },
  { name: "Schreinerei Krüger", trade: "Tischler / Schreiner", city: "Vellmar", plz: "34246" },
  { name: "Dachdeckerei Böhm", trade: "Dachdecker", city: "Kassel", plz: "34131" },
  { name: "Fliesen Wolf", trade: "Fliesenleger", city: "Göttingen", plz: "37075" },
  { name: "Bau GmbH Lorenz", trade: "Maurer", city: "Kaufungen", plz: "34260" },
  { name: "Holzbau Deutschmann", trade: "Zimmermann", city: "Zierenberg", plz: "34289" },
  { name: "GalaBau Sonnenfeld", trade: "Garten- und Landschaftsbau", city: "Göttingen", plz: "37081" },
  { name: "Fenster & Türen Brandt", trade: "Fenster und Türen", city: "Niestetal", plz: "34266" },
  { name: "Parkett Franz", trade: "Bodenbelag / Parkett", city: "Kassel", plz: "34123" },
  { name: "Heizung Klima Roth", trade: "Heizung und Klima", city: "Baunatal", plz: "34225" },
  { name: "Elektrohandel Meiser", trade: "Elektriker", city: "Hann. Münden", plz: "34346" },
  { name: "Installation Butz", trade: "Klempner / Installateur (Sanitär, Heizung)", city: "Göttingen", plz: "37077" },
  { name: "Malerteam Adler", trade: "Maler / Lackierer", city: "Lohfelden", plz: "34253" },
  { name: "Tischlerei Vogel", trade: "Tischler / Schreiner", city: "Göttingen", plz: "37079" },
  { name: "Dachbedeckung Hahn", trade: "Dachdecker", city: "Wolfhagen", plz: "34466" },
  { name: "Fliesenstudio Berg", trade: "Fliesenleger", city: "Kassel", plz: "34121" },
  { name: "Maurermeister Gross", trade: "Maurer", city: "Northeim", plz: "37154" },
  { name: "Landschaftsbau Fuchs", trade: "Garten- und Landschaftsbau", city: "Kassel", plz: "34128" },
];

const KASSEL = { lat: 51.3127, lon: 9.4797 };
const RA = 50; // km radius
const DEG_KM = 111.0;

function randomCoords() {
  // random point within radius around Kassel
  const r = Math.sqrt(Math.random()) * RA;
  const theta = Math.random() * 2 * Math.PI;
  return {
    latitude: KASSEL.lat + (r / DEG_KM) * Math.cos(theta),
    longitude: KASSEL.lon + (r / (DEG_KM * Math.cos((KASSEL.lat * Math.PI) / 180))) * Math.sin(theta),
  };
}

const SERVICES_BY_TRADE = {
  Elektriker: [
    { name: "Elektroinstallation", price: 85, duration: 60 },
    { name: "Fehleranalyse", price: 95, duration: 45 },
    { name: "Lampen montieren", price: 50, duration: 30 },
  ],
  "Klempner / Installateur (Sanitär, Heizung)": [
    { name: "Sanitärinstallation", price: 90, duration: 60 },
    { name: "Heizungsservice", price: 110, duration: 90 },
    { name: "Wasserhahn wechseln", price: 60, duration: 30 },
  ],
  "Maler / Lackierer": [
    { name: "Wandanstrich", price: 120, duration: 60 },
    { name: "Fassadenanstrich", price: 800, duration: 480 },
    { name: "Tapete streichen", price: 90, duration: 60 },
  ],
  "Tischler / Schreiner": [
    { name: "Maßmöbel", price: 650, duration: 360 },
    { name: "Tür einbauen", price: 200, duration: 120 },
    { name: "Fußboden schleifen", price: 30, duration: 60 },
  ],
  Dachdecker: [
    { name: "Dachinspektion", price: 100, duration: 60 },
    { name: "Ziegel wechseln", price: 80, duration: 60 },
    { name: "Dacheindeckung", price: 950, duration: 480 },
  ],
  Fliesenleger: [
    { name: "Bad fliesen", price: 75, duration: 60 },
    { name: "Boden verlegen", price: 60, duration: 60 },
    { name: "Silikonfugen erneuern", price: 45, duration: 30 },
  ],
  Maurer: [
    { name: "Mauerwerk setzen", price: 120, duration: 120 },
    { name: "Sanierung Fassade", price: 700, duration: 480 },
  ],
  Zimmermann: [
    { name: "Dachstuhl", price: 950, duration: 480 },
    { name: "Holzterrasse", price: 300, duration: 240 },
  ],
  "Garten- und Landschaftsbau": [
    { name: "Rasen pflegen", price: 55, duration: 60 },
    { name: "Hecke schneiden", price: 70, duration: 60 },
    { name: "Pflasterarbeiten", price: 90, duration: 60 },
  ],
  "Fenster und Türen": [
    { name: "Fenster einbauen", price: 250, duration: 180 },
    { name: "Tür montieren", price: 180, duration: 120 },
  ],
  "Bodenbelag / Parkett": [
    { name: "Laminat verlegen", price: 25, duration: 60 },
    { name: "Parkett verlegen", price: 45, duration: 60 },
    { name: "Teppich entfernen", price: 20, duration: 30 },
  ],
  "Heizung und Klima": [
    { name: "Heizungs-Check", price: 140, duration: 90 },
    { name: "Wartung Heizung", price: 120, duration: 60 },
  ],
};

const PHONES = ["0171 5551234", "0151 2468108", "0162 9988776", "0179 3218765", "0157 4455667"];
const BIOS = [
  "Meisterbetrieb aus der Region, seit über 20 Jahren im Handwerk verwurzelt.",
  "Schnelle Termine, faire Festpreise und saubere Arbeit - direkt vom Meister.",
  "Familienbetrieb mit Werkstatt vor Ort. Kostenlose Beratung im Vorfeld.",
  "Geprüfter Meisterbetrieb. Zuverlässig, pünktlich und versichert.",
  "Modern aufgestellt, traditionell auf Qualität geprüft.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createMaster(index, m) {
  const email = `fake-master-${index + 1}@example.com`;
  const password = "FakeMaster2024!";

  const { data, error: userErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "master", full_name: m.name },
  });
  if (userErr) {
    // User may already exist from a previous run; still try to activate.
    console.log(`  skip create for ${email}: ${userErr.message}`);
    return { email, user: null, created: false };
  }
  console.log(`  created ${email} -> ${data.user.id}`);
  return { email, user: data.user, created: true };
}

async function main() {
  const failed = [];
  let createdCount = 0;

  for (let i = 0; i < MASTERS.length; i++) {
    const m = MASTERS[i];
    console.log(`[${i + 1}/${MASTERS.length}] ${m.name}`);

    const { email, user, created } = await createMaster(i, m);
    if (!created) {
      // Look up existing user by email via admin list
      const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
      if (listErr) {
        console.error(`  ${listErr.message}`);
        failed.push(m.name);
        continue;
      }
      const found = list.users.find((u) => u.email === email);
      if (!found) {
        console.error(`  user not found`);
        failed.push(m.name);
        continue;
      }
      await fillProfile(i, m, found.id);
      createdCount++;
      continue;
    }
    createdCount++;
    await fillProfile(i, m, user.id);
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Masters processed: ${createdCount} / ${MASTERS.length}`);
  if (failed.length) console.log("Failed:", failed.join(", "));
}

async function fillProfile(index, m, userId) {
  void index;
  const coords = randomCoords();

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      master_status: "active",
      trade: m.trade,
      city: m.city,
      plz: m.plz,
      bio: pick(BIOS),
      phone: pick(PHONES),
      latitude: coords.latitude,
      longitude: coords.longitude,
    })
    .eq("id", userId);

  if (profileErr) {
    console.error(`  profile update failed: ${profileErr.message}`);
    return;
  }

  const services = SERVICES_BY_TRADE[m.trade] ?? [];
  for (const s of services) {
    await supabase.from("services").insert({
      master_id: userId,
      name: s.name,
      price: s.price,
      duration_minutes: s.duration,
    });
  }

  // Working hours: Mon-Fri 08-17, Sat 09-13 (50% chance)
  for (let dow = 1; dow <= 6; dow++) {
    if (dow === 6 && Math.random() < 0.5) continue;
    await supabase.from("working_hours").insert({
      master_id: userId,
      day_of_week: dow,
      start_time: dow === 6 ? "09:00:00" : "08:00:00",
      end_time: dow === 6 ? "13:00:00" : "17:00:00",
    });
  }

  const servicesCount = services.length;
  console.log(`  activated, ${servicesCount} services, hours set`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});