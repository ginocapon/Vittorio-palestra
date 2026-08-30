# SKILL — Vittorio · Gestione scheda

> Repo gestione scheda **Vittorio**. Architettura da `ginevra` (JSON + admin + PDF). Profilo in `data/profilo.json`.

---

## 1. Profilo atleta

| Campo | Valore |
|-------|--------|
| Nome | Vittorio |
| Età | **54** |
| Altezza | **180 cm** |
| Peso | **78 kg** |
| Livello | **Neofita** (gambe più avanzate, upper da costruire) |
| Infortuni | **2 ernie lombari** — solo macchine/cavi, schiena appoggiata |
| Obiettivo | Ricostruzione corporea, surplus leggero, **~60% volume parte alta** |
| Frequenza | **3 sedute/settimana** · A+B · B+C · A+C |

---

## 2. Schede trimestrali (4 × 13 settimane)

**Principio neofita:** stessi esercizi per tutto il trimestre. La progressione è il **volume di lavoro** (serie e ripetizioni), non i kg.

| Trimestre | Periodo | Volume regime |
|-----------|---------|---------------|
| **T1 · Base** | set–nov 2026 | Serie in scheda = target sett. 8–12 |
| **T2 · Volume +** | dic–feb 2027 | T1 + **+1 serie** sui fondamentali * |
| **T3 · Picco upper** | mar–mag 2027 | T2 + **+1 serie** su complementari upper |
| **T4 · Consolidamento** | giu–ago 2027 | **−15% volume**, RIR 3, tecnica |

**Deload obbligatori:** settimane **13, 26, 39, 52** (−40% serie).

### Progressione settimanale (ogni trimestre)

| Settimane | Serie | RIR | Note |
|-----------|-------|-----|------|
| 1–2 | 2/esercizio | 4 | Impara macchine |
| 3–4 | 2–3 | 3–4 | Aggiungi volume, non kg |
| 5–6 | ~80% regime | 3 | Avvicinamento regime |
| 7–8 | 100% regime | 2–3 | Primo picco trimestre |
| 9 | −25% | 3 | Deload parziale |
| 10–12 | 100% regime | 2 | Picco volume trimestre |
| 13 | −40% | 4–5 | Chiusura trimestre |

**Ordine progressione carico:** 1) serie 2) ripetizioni nel range 3) +2,5 kg macchina solo se tutto pulito.

---

## 3. Settimana tipo

| Seduta | Contenuto |
|--------|-----------|
| **AB** | Spinta parte alta + 2 esercizi gambe leggero |
| **BC** | Tirata parte alta + gambe leggero |
| **AC** | Solo upper — massimo stimolo parte alta |

---

## 4. Regole schiena (obbligatorie)

- **Vietati:** squat, stacchi, crunch, iperestensioni, rematore libero piegato
- **Core:** dead bug, pallof press, bird dog
- **Stop** se dolore lombare

---

## 5. Sync dati

```bash
node tools/sync-vittorio-trimestri.mjs   # 4 trimestri → macrociclo
node tools/sync-blocco1-macrociclo.mjs   # solo T1 da blocco-1-fase1.json
```

Deploy: `https://ginocapon.github.io/Vittorio-palestra/`
