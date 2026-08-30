#!/usr/bin/env node
/**
 * Checklist Ginevra — Full Body A+B/B+C/A+C, 3 sedute, deload 13
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const macro = JSON.parse(readFileSync(join(REPO, "admin/data/macrociclo-2026-2027.json"), "utf8"));
const blocco = JSON.parse(readFileSync(join(REPO, "admin/data/blocco-1-fase1.json"), "utf8"));
const catalogo = JSON.parse(readFileSync(join(REPO, "admin/data/esercizi-catalogo.json"), "utf8"));
const hub = JSON.parse(readFileSync(join(REPO, "admin/data/hub-periodizzazione.json"), "utf8"));
const meso = JSON.parse(readFileSync(join(REPO, "admin/data/mesocicli.json"), "utf8"));

const KEYS = ["ab", "bc", "ac"];
const errors = [];
const ok = [];

function fail(msg) { errors.push(msg); }
function pass(msg) { ok.push(msg); }

const ALIASES = {
  "Romanian Deadlift": "Stacco Rumeno",
  "Leg Press": "Pressa",
  "Leg Curl seduto": "Leg curl seduto",
  "Leg Curl unilaterale": "Leg Curl",
  "Calf in piedi": "Polpacci in piedi",
  "Calf seduto": "Polpacci seduto",
  "Calf alla pressa": "Polpacci multipower",
  "Shoulder Press": "Lento avanti bilanciere",
  "Curl manubri": "Curl bilanciere EZ",
  "Pushdown tricipiti": "Estensioni tricipiti al cavo",
  "Estensione tricipiti cavo": "Estensioni tricipiti al cavo",
  "Crunch": "Crunch ai cavi",
  "Rematore macchina": "Rematore bilanciere",
  "Rematore unilaterale": "Rematore bilanciere",
  "Panca inclinata macchina": "Chest press alla macchina",
  "Back Extension": "Stacco Rumeno",
  "Abductor Machine": "Abduzione glutei alla macchina"
};

function lookupCat(nome) {
  const key = ALIASES[nome] || nome;
  if (catalogo[key]) return catalogo[key];
  const n = (key || "").toLowerCase();
  for (const k of Object.keys(catalogo)) {
    if (k.toLowerCase() === n) return catalogo[k];
  }
  return null;
}

function isLower(ex) {
  return /gambe|polpacci|glutei|femorali|quadricipiti|catena posteriore|adduttori|abduttori/i.test(ex.gruppo || "") ||
    /pressa|extension|squat|leg curl|stacco|affondo|polpacci|rumeno|hip thrust|bulgarian|abductor|back extension/i.test(ex.nome || "");
}

function isGluteHam(ex) {
  return /glutei|femorali|catena posteriore/i.test(ex.gruppo || "") ||
    /hip thrust|rumeno|leg curl|bulgarian|back extension|abductor/i.test(ex.nome || "");
}

if (macro.macrociclo.profilo?.giorniSettimana !== 3) fail("giorniSettimana deve essere 3");
else pass("3 giorni/settimana");

if (!/full body|a\+b/i.test(macro.macrociclo.profilo?.split || macro.macrociclo.lineeGuida || "")) {
  fail("manca split Full Body A+B/B+C/A+C");
} else pass("split Full Body in linee guida");

if (macro.fasi.length !== 4) fail("Attese 4 fasi");
else pass("4 fasi macro");

macro.fasi.forEach((f) => {
  if (f.settimane < 12) fail(f.id + " ha " + f.settimane + " sett.");
  else pass(f.id + " · " + f.settimane + " sett.");
  if (!f.perche) fail(f.id + " manca perche");
  if (!f.intensitaRecupero?.intensita || !f.intensitaRecupero?.recupero) fail(f.id + " manca intensitaRecupero");
  else pass(f.id + " intensità/recupero");
  KEYS.forEach((k) => { if (!f.sessioni[k]) fail(f.id + " manca sessione " + k); });
  let total = 0;
  let lower = 0;
  let gluteHam = 0;
  for (const s of Object.values(f.sessioni)) {
    if ((s.esercizi || []).length > 16) fail(f.id + " " + s.nome + " ha troppi esercizi (>16)");
    for (const ex of s.esercizi) {
      const sets = Number(ex.serie) || 0;
      total += sets;
      if (isLower(ex)) lower += sets;
      if (isGluteHam(ex)) gluteHam += sets;
      if (ex.peso && ex.peso !== "—" && ex.peso !== "-") fail(f.id + " " + ex.nome + " peso non blank");
      const cat = lookupCat(ex.nome);
      const fig = ex.figura || cat?.figura;
      if (!fig || fig === "fig-generico") fail(f.id + " " + ex.nome + " senza figura catalogo");
    }
  }
  const ghPct = (100 * gluteHam) / total;
  if (ghPct < 25) fail(f.id + " glutei/femorali " + ghPct.toFixed(1) + "% (atteso ~25%+)");
  else pass(f.id + " glutei/femorali " + ghPct.toFixed(1) + "% (" + gluteHam + "/" + total + ")");
});

KEYS.forEach((k) => {
  if (!blocco.sessioni[k]) { fail("blocco manca " + k); return; }
  blocco.sessioni[k].esercizi.forEach((ex) => {
    if (!ex.figura && !lookupCat(ex.nome)?.figura) fail("blocco " + k + " " + ex.nome + " senza figura");
  });
});
if (!blocco.ingressoGraduale) fail("blocco manca ingressoGraduale");
else pass("Blocco 1 ingresso graduale sett. 1–4");

if (!hub.anni?.length) fail("hub-periodizzazione.json senza anni");
else pass("hub anni: " + hub.anni.map((a) => a.id).join(", "));

console.log(ok.map((x) => "OK  " + x).join("\n"));
if (errors.length) {
  console.error(errors.map((x) => "ERR " + x).join("\n"));
  process.exit(1);
}
console.log("CHECKLIST SUPERATA");
