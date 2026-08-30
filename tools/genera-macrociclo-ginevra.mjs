#!/usr/bin/env node
/**
 * Genera macrociclo Ginevra — Full Body A+B / B+C / A+C (4 fasi × 13 sett.)
 * Uso: node tools/genera-macrociclo-ginevra.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const CATALOGO = JSON.parse(readFileSync(join(REPO, "admin/data/esercizi-catalogo.json"), "utf8"));

function fig(nome) {
  const aliases = {
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
  const key = aliases[nome] || nome;
  if (CATALOGO[key]?.figura) return CATALOGO[key].figura;
  if (CATALOGO[nome]?.figura) return CATALOGO[nome].figura;
  const n = (key || "").toLowerCase();
  for (const k of Object.keys(CATALOGO)) {
    if (k.toLowerCase() === n) return CATALOGO[k].figura;
  }
  return "fig-generico";
}

function ex(nome, gruppo, serie, rip, rec, note, progressione = false) {
  return {
    nome,
    gruppo,
    serie,
    ripetizioni: rip,
    peso: "—",
    recupero: rec,
    rir: progressione ? "2→1" : "2",
    figura: fig(nome),
    note,
    progressione
  };
}

const sedutaAB = (fase) => {
  const htSerie = fase === 3 ? 4 : 3;
  return {
    nome: "A+B · Glutei + petto",
    codice: "AB",
    accoppiamento: "A + B",
    notaSeduta: "Priorità glutei e petto. Completa tutto il blocco lower prima dell'upper.",
    durataMinuti: { obiettivo: fase === 1 ? 65 : 75, tetto: fase === 1 ? 75 : 85 },
    esercizi: [
      ex("Hip Thrust", "Glutei", htSerie, "8–10", "150 sec", "Fondamentale glutei *; pausa in massima contrazione.", true),
      ex("Romanian Deadlift", "Femorali", 2, "8–10", "150 sec", "Femorali e glutei; eccentrica controllata.", true),
      ex("Leg Press", "Quadricipiti", 2, "10–12", "120 sec", "Piedi medio-alti; quadricipiti proporzionati."),
      ex("Leg Curl seduto", "Femorali", 2, "10–12", "90 sec", "Controllo dell'eccentrica."),
      ex("Calf in piedi", "Polpacci", 3, "10–15", "75 sec", "Escursione completa."),
      ex("Panca inclinata manubri", "Petto", 3, "8–10", "120 sec", "Petto: priorità upper *.", true),
      ex("Croci ai cavi", "Petto", 2, "12–15", "75 sec", "Tensione continua."),
      ex("Lat Machine presa neutra", "Dorsali", 2, "8–12", "120 sec", "Schiena completa."),
      ex("Shoulder Press", "Spalle", 2, "8–10", "120 sec", "Spalle; movimento stabile.", true),
      ex("Alzate laterali", "Spalle", 2, "12–15", "75 sec", "Niente slanci."),
      ex("Curl manubri", "Bicipiti", 2, "10–12", "75 sec", "Bicipiti."),
      ex("Pushdown tricipiti", "Tricipiti", 2, "10–15", "75 sec", "Tricipiti."),
      ex("Crunch", "Addome", 2, "12–15", "60 sec", "Addome.")
    ]
  };
};

const sedutaBC = () => ({
  nome: "B+C · Femorali + schiena",
  codice: "BC",
  accoppiamento: "B + C",
  notaSeduta: "Priorità femorali e schiena. Lower completo, poi upper.",
  durataMinuti: { obiettivo: 65, tetto: 75 },
  esercizi: [
    ex("Romanian Deadlift", "Femorali", 3, "8–10", "150 sec", "Fondamentale catena posteriore *.", true),
    ex("Leg Curl sdraiato", "Femorali", 3, "10–12", "90 sec", "Femorali in accorciamento."),
    ex("Bulgarian Split Squat", "Glutei", 2, "10–12/gamba", "120 sec", "Glute bias; passo lungo."),
    ex("Leg Press", "Quadricipiti", 2, "10–12", "120 sec", "Quadricipiti controllati."),
    ex("Calf seduto", "Polpacci", 3, "12–15", "75 sec", "Escursione completa."),
    ex("Rematore macchina", "Dorsali", 3, "8–12", "120 sec", "Schiena: priorità upper *.", true),
    ex("Lat Machine presa neutra", "Dorsali", 2, "10–12", "90 sec", "Tirata controllata."),
    ex("Panca inclinata macchina", "Petto", 2, "8–12", "120 sec", "Petto: seconda esposizione settimanale."),
    ex("Reverse Pec Deck", "Spalle", 2, "12–15", "75 sec", "Deltoide posteriore."),
    ex("Alzate laterali", "Spalle", 2, "12–15", "75 sec", "Deltoide laterale."),
    ex("Curl Scott", "Bicipiti", 2, "10–12", "75 sec", "Bicipiti."),
    ex("Estensione tricipiti cavo", "Tricipiti", 2, "10–15", "75 sec", "Tricipiti."),
    ex("Crunch", "Addome", 2, "12–15", "60 sec", "Controllo.")
  ]
});

const sedutaAC = (fase) => {
  const abdSerie = fase === 3 ? 3 : 2;
  return {
    nome: "A+C · Glutei + petto",
    codice: "AC",
    accoppiamento: "A + C",
    notaSeduta: "Seconda seduta glutei/petto. Lower completo, poi upper.",
    durataMinuti: { obiettivo: 65, tetto: 75 },
    esercizi: [
      ex("Hip Thrust", "Glutei", 3, "8–12", "150 sec", "Glute bridge alternativo se serve.", true),
      ex("Back Extension", "Glutei", 2, "10–15", "90 sec", "Movimento dall'anca; glute bias."),
      ex("Leg Curl unilaterale", "Femorali", 2, "10–15/gamba", "90 sec", "Femorali."),
      ex("Leg Press", "Quadricipiti", 2, "10–12", "120 sec", "Quadricipiti controllati."),
      ex("Abductor Machine", "Glutei", abdSerie, "15–20", "60 sec", "Gluteo medio."),
      ex("Calf alla pressa", "Polpacci", 3, "12–15", "75 sec", "Escursione completa."),
      ex("Panca inclinata manubri", "Petto", 3, "8–10", "150 sec", "Petto: grande priorità *.", true),
      ex("Croci ai cavi", "Petto", 2, "12–15", "75 sec", "Petto."),
      ex("Rematore unilaterale", "Dorsali", 2, "10–12", "90 sec", "Schiena: seconda esposizione."),
      ex("Shoulder Press", "Spalle", 2, "8–10", "120 sec", "Spalle.", true),
      ex("Alzate laterali", "Spalle", 2, "12–15", "75 sec", "Controllo."),
      ex("Curl Martello", "Bicipiti", 2, "10–12", "75 sec", "Bicipiti."),
      ex("Pushdown tricipiti", "Tricipiti", 2, "10–15", "75 sec", "Tricipiti."),
      ex("Crunch", "Addome", 2, "12–15", "60 sec", "Addome.")
    ]
  };
};

const fasiMeta = [
  {
    id: "costruzione",
    nome: "Fase 1 · Costruzione",
    inizio: "2026-09-01",
    fine: "2026-11-30",
    settimane: 13,
    faseNum: 1,
    perche:
      "Costruisce la base tecnica e muscolare. Ingresso graduale sett. 1–4 (RIR 3–4, volume ridotto su polpacci e addome), poi regime completo. Non si cerca il massimo volume: si prepara il corpo alle fasi successive.",
    intensitaRecupero: {
      intensita:
        "Sett. 1–4 ingresso: RIR 3–4, −1 serie su polpacci e addome. Sett. 5–8: RIR 2→1. Sett. 9: −25% volume, RIR 2. Sett. 10–12: picco controllato; ultima serie * a RIR 0–1. Sett. 13: deload −40%, RIR 4–5.",
      recupero: "Fondamentali 120–150 s · complementari 90–120 s · isolamenti 60–90 s.",
      durataSeduta: "obiettivo 60–65 min (sett. 1–4) · 65–75 min a regime · tetto 80 min",
      deload: "settimana 13 · −40% volume · RIR 4–5 · nessun cedimento"
    }
  },
  {
    id: "ipertrofia",
    nome: "Fase 2 · Ipertrofia",
    inizio: "2026-12-01",
    fine: "2027-02-28",
    settimane: 13,
    faseNum: 2,
    perche:
      "Aumento controllato dello stimolo ipertrofico. Stessi esercizi, più vicinanza al limite nelle settimane centrali. Il fisico cresce nel suo insieme, con glutei/femorali leggermente avanti.",
    intensitaRecupero: {
      intensita: "Sett. 14–15: RIR 3→2. Sett. 16–21: RIR 2→1. Sett. 22: −25%. Sett. 23–25: picco; ultima serie * a RIR 0–1. Sett. 26: deload.",
      recupero: "Fondamentali 120–150 s · complementari 90–120 s · isolamenti 60–90 s.",
      durataSeduta: "obiettivo 70–75 min · tetto 85 min",
      deload: "settimana 26 · −40% volume"
    }
  },
  {
    id: "specializzazione",
    nome: "Fase 3 · Specializzazione",
    inizio: "2027-03-01",
    fine: "2027-05-31",
    settimane: 13,
    faseNum: 3,
    perche:
      "Specializzazione controllata su glutei e catena posteriore. Hip thrust 4 serie in A+B, abduzione 3 serie in A+C. Petto e schiena restano 2×/sett.",
    intensitaRecupero: {
      intensita: "Sett. 27–34: RIR 2→1 sui prioritari. Sett. 35: −25%. Sett. 36–38: picco specializzazione. Sett. 39: deload.",
      recupero: "Catena posteriore: fino a 150 s se serve qualità.",
      durataSeduta: "obiettivo 75 min · tetto 85 min",
      deload: "settimana 39 · −40% volume"
    }
  },
  {
    id: "consolidamento",
    nome: "Fase 4 · Consolidamento",
    inizio: "2027-06-01",
    fine: "2027-08-31",
    settimane: 13,
    faseNum: 4,
    perche:
      "Consolida i risultati dell'anno. Volume più recuperabile, intensità moderata-alta. Chiude il ciclo pronti al nuovo macrociclo.",
    intensitaRecupero: {
      intensita: "Sett. 40–47: RIR 2→1–2. Sett. 48: −25%. Sett. 49–51: picco finale controllato. Sett. 52: deload annuale.",
      recupero: "Recuperare quanto basta per mantenere la prestazione.",
      durataSeduta: "obiettivo 65–75 min · tetto 80 min",
      deload: "settimana 52 · −40% volume · chiusura annuale"
    }
  }
];

const macro = {
  macrociclo: {
    nome: "Macrociclo 2026–2027 · Ginevra",
    inizio: "2026-09-01",
    fine: "2027-08-31",
    descrizione:
      "Full Body A+B / B+C / A+C · 3 sedute/sett. · 4 fasi × 13 sett. Glutei/femorali prioritari, petto/schiena 2×. Ingresso graduale sett. 1–4. Pesi a penna.",
    frequenza: "3 sessioni/settimana · Lun A+B · Mer B+C · Ven A+C",
    lineeGuida:
      "Full Body completo · A+B → B+C → A+C · glutei/femorali leggermente prioritari · petto/schiena 2× · deload sett. 13/26/39/52 · ingresso graduale prime 4 sett.",
    profilo: {
      nomeStampa: "Ginevra",
      notaNome: "PDF stampa: campo Atleta vuoto.",
      eta: 22,
      altezzaCm: 160,
      pesoKg: null,
      livello: "principiante-intermedio · buona base muscolare, ingresso graduale",
      obiettivoAnno:
        "Full body equilibrato, enfasi glutei/femorali. Progressione dolce prime 4 settimane. 3×/sett.",
      giorniSettimana: 3,
      split: "Full Body · A+B / B+C / A+C",
      prioritaVolume: "glutei/femorali prioritari · petto/schiena 2× · full body",
      attrezzaturaBase: "Palestra commerciale: macchine, manubri, cavi, hip thrust.",
      limitiInfortuni: "Non esagerare subito. Sett. 1–4: RIR 3–4, volume ridotto accessori.",
      dataInizio: "2026-09-01",
      preferenzaMeseCambioFase: "fine novembre / fine febbraio / fine maggio / fine agosto",
      prioritaMuscolari: "Glutei, femorali, petto, schiena, spalle, braccia",
      durataSeduta: "obiettivo 60–75 min a seconda della fase · tetto 85 min",
      toneImmagini: "Figure SVG tecniche. Foto atleta: da aggiungere."
    }
  },
  fasi: fasiMeta.map((m) => ({
    id: m.id,
    nome: m.nome,
    inizio: m.inizio,
    fine: m.fine,
    settimane: m.settimane,
    rir: m.intensitaRecupero.intensita.slice(0, 80) + "…",
    obiettivo: m.perche,
    perche: m.perche,
    intensitaRecupero: m.intensitaRecupero,
    sessioni: {
      ab: sedutaAB(m.faseNum),
      bc: sedutaBC(),
      ac: sedutaAC(m.faseNum)
    }
  }))
};

const blocco1 = {
  id: "costruzione",
  codice: "FASE 1",
  tipo: "COSTRUZIONE · FULL BODY",
  nome: "Fase 1 · Costruzione",
  inizio: "2026-09-01",
  fine: "2026-11-30",
  settimane: 13,
  frequenza: "3 allenamenti/settimana · A+B → B+C → A+C",
  durataSeduta: "obiettivo 60–65 min (ingresso) · 65–75 min a regime · tetto 80 min",
  guida:
    "Prima fase: adattamento tecnico e base muscolare. Settimane 1–4 = ingresso graduale per atleta che inizia/incrementa: RIR 3–4, polpacci 2 serie invece di 3, addome 1 serie o saltato, durata 55–65 min. Dal mese 2 (sett. 5) si passa al regime del PDF.",
  schedaIntro:
    "Full Body A+B / B+C / A+C. Glutei e femorali prioritari; petto e schiena 2×. Lower completo prima dell'upper in ogni seduta.",
  ingressoGraduale: {
    settimane: "1–4",
    rir: "3–4 (non scendere sotto RIR 3)",
    volume:
      "Polpacci: 2 serie invece di 3. Addome: 1 serie o salta sett. 1–2. Resto invariato ma carichi conservativi.",
    durata: "55–65 min target",
    nota: "A 22 anni, in forma e magra: buona base, ma non forzare. Obiettivo = arrivare a sett. 5 fresca e con tecnica solida."
  },
  periodizzazione: [
    { fase: "Ingresso graduale", settimane: "1–4", rir: "3–4", obiettivo: "Tecnica, volume ridotto accessori, 55–65 min" },
    { fase: "Adattamento regime", settimane: "5–6", rir: "3→2", obiettivo: "Volume pieno, carichi in salita" },
    { fase: "Accumulo", settimane: "7–8", rir: "2→1", obiettivo: "Stimolo crescente sostenibile" },
    { fase: "Scarico parziale", settimane: "9", rir: "2", obiettivo: "−25% volume" },
    { fase: "Picco controllato", settimane: "10–12", rir: "1; ultima * 0–1", obiettivo: "Picco fase 1" },
    { fase: "Deload", settimane: "13", rir: "4–5", obiettivo: "−40% volume, chiusura blocco" }
  ],
  recuperi: [
    { tipologia: "Fondamentali", recupero: "120–150 sec" },
    { tipologia: "Complementari", recupero: "90–120 sec" },
    { tipologia: "Isolamenti", recupero: "60–90 sec" }
  ],
  regoleBlocco: {
    sett1_4: [
      "RIR 3–4 su tutte le serie",
      "Polpacci: 2 serie. Addome: 1 serie o skip",
      "Nessun cedimento, nessun PR",
      "Durata 55–65 min"
    ],
    sett5_8: ["Volume regime completo", "RIR 2→1 progressivo", "Aumenta carico solo con tecnica stabile"],
    sett9: ["−25% serie", "RIR 2"],
    sett10_12: ["Regime; ultima serie fondamentali * a RIR 0–1 se tecnica ok"],
    sett13: ["−40% serie", "RIR 4–5", "Deload obbligatorio"]
  },
  sessioni: {
    ab: sedutaAB(1),
    bc: sedutaBC(),
    ac: sedutaAC(1)
  }
};

writeFileSync(join(REPO, "admin/data/macrociclo-2026-2027.json"), JSON.stringify(macro, null, 2) + "\n", "utf8");
writeFileSync(join(REPO, "admin/data/blocco-1-fase1.json"), JSON.stringify(blocco1, null, 2) + "\n", "utf8");

console.log("OK genera-macrociclo-ginevra");
console.log("Fasi:", macro.fasi.map((f) => f.id).join(", "));
console.log("Sessioni:", Object.keys(macro.fasi[0].sessioni).join(", "));
