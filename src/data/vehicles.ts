import type { Vehicle } from "../types";

export const VEHICLES: Vehicle[] = [
  {
    id: "civic",
    name: "2019 Honda Civic",
    year: 2019,
    make: "Honda",
    model: "Civic EX",
    icon: "🚗",
    kind: "car",
    blurb: "1.5L turbo I4. Daily driver in for a no-start complaint.",
    engineProfile: "i4",
  },
  {
    id: "f150",
    name: "2020 Ford F-150",
    year: 2020,
    make: "Ford",
    model: "F-150 XLT",
    icon: "🛻",
    kind: "truck",
    blurb: "5.0L Coyote V8. Rough running with the MIL illuminated.",
    engineProfile: "v8",
  },
  {
    id: "camry",
    name: "2016 Toyota Camry",
    year: 2016,
    make: "Toyota",
    model: "Camry SE",
    icon: "🚙",
    kind: "car",
    blurb: "3.5L V6. Here for a maintenance oil & filter service.",
    engineProfile: "v6",
  },
  {
    id: "mower",
    name: "Rusty Rider Lawnmower",
    year: 2007,
    make: "TurfBeast",
    model: "Rider 500",
    icon: "🚜",
    kind: "small-engine",
    blurb: "Single-cylinder OHV. 'Cranks but won't run' after winter storage.",
    engineProfile: "single-cylinder",
  },
  {
    id: "flintmobile",
    name: "Flintstone Foot-Mobile",
    year: null,
    make: "Bedrock",
    model: "Foot-Mobile DX",
    icon: "🦴",
    kind: "novelty",
    blurb: "Stone-age hypercar. Pedal-powered, granite brakes, one very tired dino.",
    engineProfile: "novelty",
  },
];

export const VEHICLE_MAP: Record<string, Vehicle> = Object.fromEntries(
  VEHICLES.map((v) => [v.id, v]),
);
