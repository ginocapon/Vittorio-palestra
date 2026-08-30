#!/usr/bin/env node
/**
 * Sincronizza tutti e 4 i trimestri del macrociclo Vittorio (neofita)
 * da admin/data/blocco-1-fase1.json — stessi esercizi, volume progressivo.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const MACRO = join(REPO, "admin/data/macrociclo-2026-2027.json");
const BLOCCO = join(REPO, "admin/data/blocco-1-fase1.json");

const UPPER = new Set(["Petto", "Dorsali", "Spalle", "Tricipiti", "Bicipiti", "Deltoide posteriore"]);

const TRIMESTRI = [
  {
    id: "costruzione",
    numero: 1,
    nome: "Trimestre 1 · Base neofita",
    inizio: "2026-09-01",
    fine: "2026-11-30",
    bonusFondamentali: 0,
    bonusUpper: 0,
    moltiplicatore: 1,
    perche:
      "Neofita: imparare le macchine e costruire volume piano. Stessi esercizi 13 settimane. Progressione = serie e ripetizioni, non kg. Sett. 1–2: 2 serie; sett. 7–12: regime scheda; sett. 13: deload.",
    intensita:
      "Volume lavoro crescente sett. 1→12. Sett. 1–2: 2 serie, RIR 4. Sett. 3–4: 2–3 serie, RIR 3–4. Sett. 5–8: salita al regime, RIR 3→2. Sett. 9: −25% serie. Sett. 10–12: regime, RIR 2. Sett. 13: −40%, RIR 4–5.",
    durata: "obiettivo 50–55 min (sett. 1–4) · 65–75 min a regime · tetto 80 min",
  },
  {
    id: "ipertrofia",
    numero: 2,
    nome: "Trimestre 2 · Volume +",
    inizio: "2026-12-01",
    fine: "2027-02-28",
    bonusFondamentali: 1,
    bonusUpper: 0,
    moltiplicatore: 1,
    perche:
      "Stessi esercizi del T1, più volume sui fondamentali * (+1 serie). Stessa logica settimanale neofita: si parte da 2 serie e si risale al nuovo regime in 6–8 settimane.",
    intensita:
      "Regime T2 = T1 +1 serie sui *. Sett. 14–15: 2–3 serie ingresso. Sett. 16–21: salita volume, RIR 2–3. Sett. 22: −25%. Sett. 23–25: regime T2. Sett. 26: deload −40%.",
    durata: "obiettivo 65–75 min · tetto 85 min",
  },
  {
    id: "specializzazione",
    numero: 3,
    nome: "Trimestre 3 · Picco volume upper",
    inizio: "2027-03-01",
    fine: "2027-05-31",
    bonusFondamentali: 1,
    bonusUpper: 1,
    moltiplicatore: 1,
    perche:
      "Picco annuale del volume upper: +1 serie sui complementari petto/dorso/spalle/braccia oltre ai fondamentali. Gambe e core invariati. Progressione ancora volume-first.",
    intensita:
      "Regime T3 = massimo volume upper dell'anno. Stessa struttura 13 sett. con deload sett. 39. RIR 2 max, mai cedimento lombare.",
    durata: "obiettivo 70–75 min · tetto 85 min",
  },
  {
    id: "consolidamento",
    numero: 4,
    nome: "Trimestre 4 · Consolidamento",
    inizio: "2027-06-01",
    fine: "2027-08-31",
    bonusFondamentali: 0,
    bonusUpper: 0,
    moltiplicatore: 0.85,
    perche:
      "Consolidare tecnica e tessuto costruito. Volume −15% vs picco T3, RIR 3. Stessi esercizi. Chiude l'anno integri prima di ripartire.",
    intensita:
      "Volume ridotto (~85% regime T1). RIR 3, nessun cedimento. Sett. 40–51 progressione dolce; sett. 52 deload −40%.",
    durata: "obiettivo 60–70 min · tetto 80 min",
  },
];

const macro = JSON.parse(readFileSync(MACRO, "utf8"));
const blocco = JSON.parse(readFileSync(BLOCCO, "utf8"));

function isUpper(gruppo) {
  return UPPER.has(gruppo) || (gruppo || "").includes("Dorsali") || (gruppo || "").includes("Deltoide");
}

function isGambeCore(gruppo) {
  const g = gruppo || "";
  return /Quadricipiti|Femorali|Polpacci|Core|Glutei/i.test(g);
}

function adjustSerie(ex, trim) {
  let s = ex.serie;
  if (ex.progressione) s += trim.bonusFondamentali;
  else if (isUpper(ex.gruppo) && !isGambeCore(ex.gruppo)) s += trim.bonusUpper;
  if (trim.moltiplicatore !== 1) s = Math.max(2, Math.round(s * trim.moltiplicatore));
  return s;
}

function toMacroEx(ex, trim) {
  return {
    nome: ex.nome,
    gruppo: ex.gruppo,
    serie: adjustSerie(ex, trim),
    ripetizioni: ex.ripetizioni,
    peso: "—",
    recupero: ex.recupero,
    rir: ex.rir || "vedi regole trimestre",
    tempo: ex.tempo,
    progressione: Boolean(ex.progressione),
    figura: ex.figura || null,
    note: ex.note || null,
  };
}

function buildSessioni(trim) {
  const sessioni = {};
  for (const key of ["ab", "bc", "ac"]) {
    const s = blocco.sessioni[key];
    sessioni[key] = {
      nome: s.codice + " · " + s.nome,
      codice: s.codice,
      accoppiamento: s.accoppiamento,
      notaSeduta: s.notaSeduta,
      durataMinuti: s.durataMinuti,
      esercizi: s.esercizi.map((ex) => toMacroEx(ex, trim)),
    };
  }
  return sessioni;
}

for (const trim of TRIMESTRI) {
  const idx = macro.fasi.findIndex((f) => f.id === trim.id);
  if (idx === -1) throw new Error("Fase non trovata: " + trim.id);

  macro.fasi[idx] = {
    ...macro.fasi[idx],
    nome: trim.nome,
    inizio: trim.inizio,
    fine: trim.fine,
    settimane: 13,
    rir: trim.intensita,
    obiettivo: blocco.schedaIntro,
    perche: trim.perche,
    guida: blocco.guida,
    schedaIntro: `Trimestre ${trim.numero} · stessi esercizi AB/BC/AC · progressione volume lavoro`,
    intensitaRecupero: {
      intensita: trim.intensita,
      recupero: "Fondamentali 120–150 s · complementari 90–120 s · isolamenti 60–75 s.",
      durataSeduta: trim.durata,
      deload: `settimana ${trim.numero * 13} · −40% volume · RIR 4–5`,
    },
    sessioni: buildSessioni(trim),
  };
}

macro.macrociclo.descrizione =
  "Neofita · 4 trimestri × 13 sett. · A+B / B+C / A+C · progressione volume lavoro (serie/rep prima dei kg) · parte alta ~60% · schiena protetta.";
macro.macrociclo.lineeGuida =
  "Neofita · schede trimestrali progressive · stessi esercizi per trimestre · volume lavoro crescente · deload sett. 13/26/39/52";
macro.macrociclo.profilo.livello = "neofita · gambe più avanzate · parte alta da costruire · 2 ernie lombari";
macro.macrociclo.profilo.obiettivoAnno =
  "Ricostruzione corporea neofita: 4 trimestri progressivi per volume. Surplus leggero. 3×/sett.";
macro.macrociclo.profilo.prioritaVolume =
  "parte alta ~60% · progressione volume lavoro trimestrale · gambe mantenimento";

writeFileSync(MACRO, JSON.stringify(macro, null, 2) + "\n");
console.log("OK — 4 trimestri sincronizzati (neofita, volume progressivo)");
