# GearShift Garage — Automotive Repair Simulator

An interactive, browser-based automotive repair simulator for students and shops —
inspired by tools like Electude, but with a movable-window shop UI, real ASE/OEM-style
repair procedures, torque validation, procedural sound, technician login + leveling,
and a few wild vehicles (a rusty rider mower and a Flintstone Foot-Mobile).

The core loop mirrors a real shop: a job starts as a **Repair Order** (customer
complaint) and is completed only when the correct diagnosis and repair are performed and
the **Work Order** (the 3 C's — Complaint, Cause, Correction) is filled out to standard.

## Features

- **Movable / resizable overlapping windows** — Garage, Repair Order, Service Bay, Tools,
  Work Order, Help — plus a collapsible tool menu (toggled by the wrench button) and a
  taskbar, in the spirit of a shop desktop.
- **Interactive tools** — OBD-II scan tool, DVOM multimeter, battery/charging tester,
  ratchet, torque wrench, impact, spark-plug socket, feeler gauge, floor jack, and more.
  Steps only proceed with the correct tool selected.
- **Realistic, data-driven repair procedures** with ordered steps, diagnostic findings,
  DTCs, and **torque-to-spec** validation (values must land within OEM tolerance).
- **Repair Order → Work Order flow** with 3 C's, correct-parts selection, labor hours,
  and a sign-off checklist. Correct work is required to close the job.
- **Login + leveling** — technician accounts persist locally; correct repairs earn XP and
  level you up (Shop Helper → Master Tech → Bedrock Certified).
- **Procedural sound** via the Web Audio API — ratchet clicks, impact bursts, torque
  click-off, scan-tool beeps, and per-engine cranking/idle.
- **Vehicles** — 2019 Honda Civic, 2020 Ford F-150, 2016 Toyota Camry, a rider lawnmower,
  and the wildcard Flintstone Foot-Mobile.

## Tech stack

- Vite + React + TypeScript
- Zustand for state
- react-rnd for draggable/resizable windows
- Web Audio API (procedural sound, no external assets)

## Development

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # typecheck + production build
```

## How to play

1. Create a technician account and log in.
2. In the **Garage**, open a job's Repair Order.
3. Work the steps in the **Service Bay**, selecting the right tool in **Tools** for each
   step and torquing fasteners to spec.
4. Start the engine to verify the fix, then complete and sign off the **Work Order** to
   earn XP.

## Notes

This is an original MVP foundation. It is inspired by professional trainers but shares no
code with them; the deep physics-accurate systems (e.g. a full nodal circuit solver,
oscilloscope waveforms) are intentionally out of scope for this first version and are
natural next steps.
