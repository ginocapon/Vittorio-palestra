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
| Infortuni | **2 ernie lombari** — solo macchine/cavi, schiena appoggiata |
| Obiettivo | Ricostruzione corporea, surplus leggero, **~60% volume parte alta** |
| Gambe | Più avanzate → **mantenimento** (pressa, leg curl, extension) |
| Frequenza | **3 sedute/settimana** · A+B · B+C · A+C |

---

## 2. Settimana tipo

| Seduta | Contenuto |
|--------|-----------|
| **AB** | Spinta parte alta (petto, spalle, tricipiti) + 2 esercizi gambe leggero |
| **BC** | Tirata parte alta (dorso, bicipiti, posteriori) + gambe leggero |
| **AC** | Parte alta completa — **solo upper**, massimo stimolo |

Lun AB · Mer BC · Ven AC (o Mar/Gio/Sab).

---

## 3. Regole schiena (obbligatorie)

- **Vietati:** squat bilanciere, stacchi, good morning, crunch, sit-up, iperestensioni lombari, rematore libero piegato, military in piedi pesante
- **Preferiti:** chest press macchina, lat machine, rematore macchina petto appoggiato, leg press, leg curl/extension
- **Core:** dead bug, pallof press, bird dog — no flessione lombare carica
- **Stop** immediato se dolore lombare; RIR minimo 2 sulle prime 4 settimane

---

## 4. Nutrizione

- Non calare peso
- Surplus **+200–300 kcal** vs mantenimento
- Proteine **1,6–2 g/kg** (125–155 g/die)
- Idratazione e sonno 7–8 h

---

## 5. PDF e schede

| Cosa | Path |
|------|------|
| Home / ciclo | `/` · `/ciclo/` |
| Scheda sessione | `/admin/sessione/?ciclo=costruzione&sessione=ab\|bc\|ac` |
| PDF sessione | `/admin/sessione/pdf/?ciclo=costruzione&sessione=ab` |

Dati: `admin/data/blocco-1-fase1.json`, `admin/data/macrociclo-2026-2027.json`

Deploy: `https://ginocapon.github.io/vittorio-palestra/`
