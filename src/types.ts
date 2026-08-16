export type ToolCategory =
  | "diagnostic"
  | "hand"
  | "power"
  | "measuring"
  | "lifting"
  | "fluids"
  | "specialty";

export interface Tool {
  id: string;
  name: string;
  short: string;
  icon: string;
  category: ToolCategory;
  description: string;
  /** Sound cue key played when the tool is actively used on a step. */
  sound: string;
}

export interface Vehicle {
  id: string;
  name: string;
  year: number | null;
  make: string;
  model: string;
  icon: string;
  kind: "car" | "truck" | "small-engine" | "novelty";
  blurb: string;
  /** Engine start/idle character used by the sound engine. */
  engineProfile: "v6" | "v8" | "i4" | "single-cylinder" | "novelty";
}

export type StepAction =
  | "inspect"
  | "scan"
  | "measure"
  | "loosen"
  | "remove"
  | "install"
  | "torque"
  | "fluid"
  | "verify";

export interface RepairStep {
  id: string;
  action: StepAction;
  label: string;
  instruction: string;
  /** Tool required to perform the step, if any. */
  requiredToolId?: string;
  hint: string;
  successText: string;
  /** Diagnostic finding revealed to the tech when this step completes. */
  reveals?: { label: string; value: string; flag?: boolean };
  /** Torque spec for `torque` steps. */
  torque?: { spec: number; unit: "ft-lb" | "in-lb" | "Nm"; tolerance: number };
}

export interface WorkOrderOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface Job {
  id: string;
  vehicleId: string;
  roNumber: string;
  title: string;
  customer: string;
  mileage: number;
  complaint: string;
  requestedService: string;
  difficulty: "Apprentice" | "Technician" | "Master" | "Wildcard";
  xpReward: number;
  procedure: RepairStep[];
  workOrder: {
    /** Candidate causes; exactly one is correct (3 C's: Cause). */
    causes: WorkOrderOption[];
    /** Candidate corrections; exactly one is correct (3 C's: Correction). */
    corrections: WorkOrderOption[];
    /** Part numbers; the correct set must be selected. */
    parts: { id: string; number: string; name: string; correct: boolean }[];
    laborHours: { spec: number; tolerance: number };
  };
}

export interface UserAccount {
  username: string;
  passwordHash: string;
  xp: number;
  completedJobIds: string[];
  createdAt: number;
}

export interface DiagnosticFinding {
  stepId: string;
  label: string;
  value: string;
  flag?: boolean;
}
