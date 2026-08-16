import { create } from "zustand";
import type { DiagnosticFinding, RepairStep, UserAccount } from "../types";
import { JOB_MAP } from "../data/jobs";
import { TOOL_MAP } from "../data/tools";
import { VEHICLE_MAP } from "../data/vehicles";
import { sound } from "../audio/soundEngine";
import { levelInfo } from "./leveling";

export type WindowId =
  | "garage"
  | "repair-order"
  | "bay"
  | "tools"
  | "work-order"
  | "help";

export interface WindowState {
  id: WindowId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  open: boolean;
  minimized: boolean;
}

export interface Feedback {
  type: "ok" | "err" | "info";
  text: string;
  ts: number;
}

interface WorkOrderDraft {
  diagnosis: string;
  causeId: string | null;
  correctionId: string | null;
  partIds: string[];
  laborHours: string;
  checklist: { resolved: boolean; verified: boolean; documented: boolean };
}

const ACCOUNTS_KEY = "gsg.accounts.v1";
const SESSION_KEY = "gsg.session.v1";

function hashPassword(pw: string): string {
  // Lightweight non-cryptographic hash. MVP/demo auth only — not for production.
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = (h * 33) ^ pw.charCodeAt(i);
  return (h >>> 0).toString(16);
}

function loadAccounts(): Record<string, UserAccount> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAccounts(accts: Record<string, UserAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accts));
}

const DEFAULT_WINDOWS: Record<WindowId, WindowState> = {
  garage: { id: "garage", x: 90, y: 90, w: 620, h: 460, z: 1, open: true, minimized: false },
  "repair-order": { id: "repair-order", x: 60, y: 70, w: 430, h: 430, z: 1, open: false, minimized: false },
  bay: { id: "bay", x: 500, y: 80, w: 560, h: 560, z: 1, open: false, minimized: false },
  tools: { id: "tools", x: 120, y: 470, w: 640, h: 250, z: 1, open: false, minimized: false },
  "work-order": { id: "work-order", x: 260, y: 90, w: 560, h: 600, z: 1, open: false, minimized: false },
  help: { id: "help", x: 200, y: 140, w: 520, h: 440, z: 1, open: false, minimized: false },
};

function freshWindows(): Record<WindowId, WindowState> {
  return JSON.parse(JSON.stringify(DEFAULT_WINDOWS));
}

interface State {
  // Auth
  user: UserAccount | null;
  authError: string | null;

  // Windows
  windows: Record<WindowId, WindowState>;
  topZ: number;
  toolMenuOpen: boolean;

  // Simulation
  activeJobId: string | null;
  stepIndex: number;
  findings: DiagnosticFinding[];
  activeToolId: string | null;
  engineRunning: boolean;
  repairComplete: boolean;
  feedback: Feedback | null;
  workOrder: WorkOrderDraft;
  justLeveledTo: number | null;

  // Auth actions
  register: (u: string, p: string) => void;
  login: (u: string, p: string) => void;
  logout: () => void;

  // Window actions
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  setWindowRect: (id: WindowId, rect: Partial<Pick<WindowState, "x" | "y" | "w" | "h">>) => void;
  toggleToolMenu: () => void;

  // Sim actions
  startJob: (jobId: string) => void;
  selectTool: (toolId: string) => void;
  performStep: (torqueValue?: number) => void;
  setWorkOrder: (patch: Partial<WorkOrderDraft>) => void;
  togglePart: (partId: string) => void;
  submitWorkOrder: () => void;
  clearLevelUp: () => void;
}

function emptyWorkOrder(): WorkOrderDraft {
  return {
    diagnosis: "",
    causeId: null,
    correctionId: null,
    partIds: [],
    laborHours: "",
    checklist: { resolved: false, verified: false, documented: false },
  };
}

function persistUser(user: UserAccount) {
  const accts = loadAccounts();
  accts[user.username.toLowerCase()] = user;
  saveAccounts(accts);
  localStorage.setItem(SESSION_KEY, user.username.toLowerCase());
}

export const useStore = create<State>((set, get) => ({
  user: null,
  authError: null,
  windows: freshWindows(),
  topZ: 10,
  toolMenuOpen: true,
  activeJobId: null,
  stepIndex: 0,
  findings: [],
  activeToolId: null,
  engineRunning: false,
  repairComplete: false,
  feedback: null,
  workOrder: emptyWorkOrder(),
  justLeveledTo: null,

  register: (u, p) => {
    const username = u.trim();
    if (username.length < 3) return set({ authError: "Username must be at least 3 characters." });
    if (p.length < 4) return set({ authError: "Password must be at least 4 characters." });
    const accts = loadAccounts();
    if (accts[username.toLowerCase()]) return set({ authError: "That username already exists. Try logging in." });
    const user: UserAccount = {
      username,
      passwordHash: hashPassword(p),
      xp: 0,
      completedJobIds: [],
      createdAt: Date.now(),
    };
    persistUser(user);
    sound.unlock();
    set({ user, authError: null, windows: freshWindows() });
  },

  login: (u, p) => {
    const accts = loadAccounts();
    const acct = accts[u.trim().toLowerCase()];
    if (!acct || acct.passwordHash !== hashPassword(p)) {
      return set({ authError: "Invalid username or password." });
    }
    localStorage.setItem(SESSION_KEY, acct.username.toLowerCase());
    sound.unlock();
    set({ user: acct, authError: null, windows: freshWindows() });
  },

  logout: () => {
    sound.stopEngine();
    localStorage.removeItem(SESSION_KEY);
    set({
      user: null,
      activeJobId: null,
      windows: freshWindows(),
      findings: [],
      activeToolId: null,
      engineRunning: false,
      repairComplete: false,
      feedback: null,
      workOrder: emptyWorkOrder(),
    });
  },

  openWindow: (id) => {
    sound.click();
    set((s) => {
      const z = s.topZ + 1;
      return {
        topZ: z,
        windows: { ...s.windows, [id]: { ...s.windows[id], open: true, minimized: false, z } },
      };
    });
  },

  closeWindow: (id) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], open: false } } })),

  focusWindow: (id) =>
    set((s) => {
      const z = s.topZ + 1;
      return { topZ: z, windows: { ...s.windows, [id]: { ...s.windows[id], z, minimized: false } } };
    }),

  minimizeWindow: (id) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } } })),

  setWindowRect: (id, rect) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], ...rect } } })),

  toggleToolMenu: () => {
    sound.click();
    set((s) => ({ toolMenuOpen: !s.toolMenuOpen }));
  },

  startJob: (jobId) => {
    const job = JOB_MAP[jobId];
    if (!job) return;
    sound.stopEngine();
    sound.click();
    set((s) => {
      const base = freshWindows();
      const wins = { ...base };
      let z = 10;
      (["repair-order", "bay", "tools"] as WindowId[]).forEach((id) => {
        wins[id] = { ...wins[id], open: true, minimized: false, z: ++z };
      });
      wins.garage = { ...wins.garage, open: false };
      return {
        activeJobId: jobId,
        stepIndex: 0,
        findings: [],
        activeToolId: null,
        engineRunning: false,
        repairComplete: false,
        workOrder: emptyWorkOrder(),
        feedback: { type: "info", text: `RO ${job.roNumber} opened. Start by verifying the complaint.`, ts: Date.now() },
        windows: wins,
        topZ: z,
        toolMenuOpen: s.toolMenuOpen,
      };
    });
  },

  selectTool: (toolId) => {
    const tool = TOOL_MAP[toolId];
    if (tool) sound.tool(tool.sound);
    set({ activeToolId: toolId });
  },

  performStep: (torqueValue) => {
    const state = get();
    const job = state.activeJobId ? JOB_MAP[state.activeJobId] : null;
    if (!job) return;
    const step: RepairStep | undefined = job.procedure[state.stepIndex];
    if (!step) return;

    // Validate required tool.
    if (step.requiredToolId && state.activeToolId !== step.requiredToolId) {
      const need = TOOL_MAP[step.requiredToolId];
      sound.error();
      return set({
        feedback: {
          type: "err",
          text: `Wrong tool for this step. Select the ${need?.name ?? "correct tool"} first.`,
          ts: Date.now(),
        },
      });
    }

    // Validate torque.
    if (step.action === "torque" && step.torque) {
      const v = Number(torqueValue);
      if (!Number.isFinite(v)) {
        sound.error();
        return set({ feedback: { type: "err", text: "Enter a torque value on the wrench.", ts: Date.now() } });
      }
      const { spec, tolerance, unit } = step.torque;
      if (Math.abs(v - spec) > tolerance) {
        sound.error();
        const dir = v < spec ? "under" : "over";
        return set({
          feedback: {
            type: "err",
            text: `${v} ${unit} is ${dir}-torqued. Spec is ${spec} ${unit} (±${tolerance}). Reset and try again.`,
            ts: Date.now(),
          },
        });
      }
    }

    // Perform the step tool sound (non-torque tools already play on select; play again on use).
    if (step.requiredToolId) {
      const tool = TOOL_MAP[step.requiredToolId];
      if (tool) sound.tool(tool.sound);
    }

    const isLast = state.stepIndex >= job.procedure.length - 1;
    const newFindings = [...state.findings];
    if (step.reveals) {
      newFindings.push({ stepId: step.id, ...step.reveals });
    }

    // Engine verify step starts the engine sound.
    if (step.action === "verify") {
      const v = VEHICLE_MAP[job.vehicleId];
      if (v) sound.startEngine(v.engineProfile);
    }

    setTimeout(() => sound.success(), 120);

    set((s) => ({
      stepIndex: Math.min(s.stepIndex + 1, job.procedure.length),
      findings: newFindings,
      engineRunning: step.action === "verify" ? true : s.engineRunning,
      repairComplete: isLast ? true : s.repairComplete,
      feedback: {
        type: "ok",
        text: step.successText + (isLast ? " All steps complete — fill out the Work Order." : ""),
        ts: Date.now(),
      },
    }));

    if (isLast) {
      setTimeout(() => get().openWindow("work-order"), 400);
    }
  },

  setWorkOrder: (patch) => set((s) => ({ workOrder: { ...s.workOrder, ...patch } })),

  togglePart: (partId) =>
    set((s) => {
      const has = s.workOrder.partIds.includes(partId);
      return {
        workOrder: {
          ...s.workOrder,
          partIds: has
            ? s.workOrder.partIds.filter((p) => p !== partId)
            : [...s.workOrder.partIds, partId],
        },
      };
    }),

  submitWorkOrder: () => {
    const s = get();
    const job = s.activeJobId ? JOB_MAP[s.activeJobId] : null;
    if (!job || !s.user) return;
    const wo = s.workOrder;
    const issues: string[] = [];

    if (!s.repairComplete) issues.push("Complete all repair steps in the Service Bay first.");
    if (wo.diagnosis.trim().length < 12) issues.push("Write a clear Diagnosis & Work Performed entry.");

    const cause = job.workOrder.causes.find((c) => c.id === wo.causeId);
    if (!cause) issues.push("Select the Cause.");
    else if (!cause.correct) issues.push("The selected Cause does not match your findings.");

    const corr = job.workOrder.corrections.find((c) => c.id === wo.correctionId);
    if (!corr) issues.push("Select the Correction.");
    else if (!corr.correct) issues.push("The selected Correction is not to standard.");

    const correctParts = job.workOrder.parts.filter((p) => p.correct).map((p) => p.id).sort();
    const chosen = [...wo.partIds].sort();
    const partsMatch =
      correctParts.length === chosen.length && correctParts.every((p, i) => p === chosen[i]);
    if (!partsMatch) issues.push("Parts used do not match the repair. Review the parts list.");

    const labor = Number(wo.laborHours);
    if (!Number.isFinite(labor) || Math.abs(labor - job.workOrder.laborHours.spec) > job.workOrder.laborHours.tolerance) {
      issues.push(`Labor hours are outside the flat-rate guide (~${job.workOrder.laborHours.spec} hr).`);
    }

    if (!wo.checklist.resolved || !wo.checklist.verified || !wo.checklist.documented) {
      issues.push("Complete the sign-off checklist.");
    }

    if (issues.length) {
      sound.error();
      return set({
        feedback: { type: "err", text: `Work order not to standard: ${issues[0]}`, ts: Date.now() },
      });
    }

    // Success — award XP once per job.
    const already = s.user.completedJobIds.includes(job.id);
    const beforeLevel = levelInfo(s.user.xp).level;
    const award = already ? Math.round(job.xpReward * 0.25) : job.xpReward;
    const updatedUser: UserAccount = {
      ...s.user,
      xp: s.user.xp + award,
      completedJobIds: already ? s.user.completedJobIds : [...s.user.completedJobIds, job.id],
    };
    persistUser(updatedUser);
    const afterLevel = levelInfo(updatedUser.xp).level;
    const leveled = afterLevel > beforeLevel;

    if (leveled) setTimeout(() => sound.levelUp(), 200);
    else sound.success();

    set((state) => ({
      user: updatedUser,
      justLeveledTo: leveled ? afterLevel : null,
      feedback: {
        type: "ok",
        text: `Job complete! +${award} XP${already ? " (repeat)" : ""}. ${leveled ? `Leveled up to ${afterLevel}!` : ""}`,
        ts: Date.now(),
      },
      windows: { ...state.windows, garage: { ...state.windows.garage, open: true, z: state.topZ + 1 } },
      topZ: state.topZ + 1,
    }));
  },

  clearLevelUp: () => set({ justLeveledTo: null }),
}));

/** Restore a prior session if present. */
export function restoreSession() {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return;
  const accts = loadAccounts();
  const acct = accts[username];
  if (acct) useStore.setState({ user: acct });
}
