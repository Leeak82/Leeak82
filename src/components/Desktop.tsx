import { useEffect } from "react";
import { useStore, type WindowId } from "../state/store";
import { sound } from "../audio/soundEngine";
import { levelInfo } from "../state/leveling";
import { JOB_MAP } from "../data/jobs";
import { VEHICLE_MAP } from "../data/vehicles";
import { Window } from "./Window";
import { InstrumentPanel } from "./InstrumentPanel";
import { GarageWindow } from "./windows/GarageWindow";
import { RepairOrderWindow } from "./windows/RepairOrderWindow";
import { BayWindow } from "./windows/BayWindow";
import { ToolsWindow } from "./windows/ToolsWindow";
import { WorkOrderWindow } from "./windows/WorkOrderWindow";
import { HelpWindow } from "./windows/HelpWindow";

const MENU: { id: WindowId; icon: string; label: string }[] = [
  { id: "garage", icon: "🏁", label: "Garage / Jobs" },
  { id: "repair-order", icon: "📋", label: "Repair Order" },
  { id: "bay", icon: "🛠️", label: "Service Bay" },
  { id: "tools", icon: "🧰", label: "Tools" },
  { id: "work-order", icon: "🧾", label: "Work Order" },
  { id: "help", icon: "❓", label: "Help" },
];

const WIN_META: Record<WindowId, { icon: string; title: string }> = {
  garage: { icon: "🏁", title: "Garage — Job Board" },
  "repair-order": { icon: "📋", title: "Repair Order" },
  bay: { icon: "🛠️", title: "Service Bay" },
  tools: { icon: "🧰", title: "Tools" },
  "work-order": { icon: "🧾", title: "Work Order" },
  help: { icon: "❓", title: "Help" },
};

export function Desktop() {
  const user = useStore((s) => s.user)!;
  const logout = useStore((s) => s.logout);
  const windows = useStore((s) => s.windows);
  const toolMenuOpen = useStore((s) => s.toolMenuOpen);
  const toggleToolMenu = useStore((s) => s.toggleToolMenu);
  const openWindow = useStore((s) => s.openWindow);
  const focusWindow = useStore((s) => s.focusWindow);
  const feedback = useStore((s) => s.feedback);
  const activeJobId = useStore((s) => s.activeJobId);
  const engineRunning = useStore((s) => s.engineRunning);
  const justLeveledTo = useStore((s) => s.justLeveledTo);
  const clearLevelUp = useStore((s) => s.clearLevelUp);

  const lvl = levelInfo(user.xp);
  const job = activeJobId ? JOB_MAP[activeJobId] : null;
  const vehicle = job ? VEHICLE_MAP[job.vehicleId] : null;

  // Unlock audio on first interaction.
  useEffect(() => {
    const unlock = () => sound.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    if (justLeveledTo == null) return;
    const t = setTimeout(clearLevelUp, 2600);
    return () => clearTimeout(t);
  }, [justLeveledTo, clearLevelUp]);

  return (
    <div className="desktop">
      <div className="topbar">
        <span className="title">GEARSHIFT GARAGE</span>
        {job && <span className="ro">{job.roNumber} · {job.title}</span>}
        <span className="spacer" />
        <div className="lvl">
          <span>
            Lv <b>{lvl.level}</b> · {lvl.title}
          </span>
          <div className="xpbar" title={`${lvl.intoLevel}/${lvl.span} XP`}>
            <i style={{ width: `${lvl.pct}%` }} />
          </div>
          <span>{user.xp} XP</span>
        </div>
        <button className="icon-btn" onClick={() => sound.setMuted(!sound.muted)} title="Toggle sound">
          🔈
        </button>
        <button className="icon-btn" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="stage">
        <div className={`engine-glow ${engineRunning ? "on" : ""}`} />
        <div className="stage-vehicle">
          <div className="veh-emoji">{vehicle ? vehicle.icon : "🏁"}</div>
          <div className="veh-name">
            {vehicle ? vehicle.name : "Select a job in the Garage to roll a vehicle into the bay"}
          </div>
        </div>

        <InstrumentPanel />

        {/* Tool menu sidebar */}
        <div className={`toolmenu ${toolMenuOpen ? "open" : ""}`}>
          <h5>Bench</h5>
          {MENU.map((m) => (
            <button key={m.id} onClick={() => openWindow(m.id)}>
              <span className="ico">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
        <button className="wrench-fab" onClick={toggleToolMenu} title="Toggle tool menu">
          🔧
        </button>

        {/* Windows */}
        <Window id="garage" {...WIN_META.garage}>
          <GarageWindow />
        </Window>
        <Window id="repair-order" {...WIN_META["repair-order"]}>
          <RepairOrderWindow />
        </Window>
        <Window id="bay" {...WIN_META.bay}>
          <BayWindow />
        </Window>
        <Window id="tools" {...WIN_META.tools}>
          <ToolsWindow />
        </Window>
        <Window id="work-order" {...WIN_META["work-order"]}>
          <WorkOrderWindow />
        </Window>
        <Window id="help" {...WIN_META.help}>
          <HelpWindow />
        </Window>

        {feedback && (
          <div key={feedback.ts} className={`toast ${feedback.type}`}>
            {feedback.text}
          </div>
        )}

        {justLeveledTo != null && (
          <div className="levelup" onClick={clearLevelUp}>
            <div className="card">
              <div className="big">LEVEL {justLeveledTo}</div>
              <div>{levelInfo(user.xp).title} unlocked!</div>
            </div>
          </div>
        )}
      </div>

      <div className="taskbar">
        {MENU.map((m) => {
          const w = windows[m.id];
          const active = w.open && !w.minimized;
          return (
            <button
              key={m.id}
              className={`tb-btn ${active ? "active" : ""}`}
              onClick={() => (active ? focusWindow(m.id) : openWindow(m.id))}
            >
              <span>{m.icon}</span>
              {WIN_META[m.id].title.split(" —")[0].split(" (")[0]}
            </button>
          );
        })}
        <span className="tb-user">👤 {user.username}</span>
      </div>
    </div>
  );
}
