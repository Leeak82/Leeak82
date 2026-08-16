import { useState } from "react";
import { useStore } from "../../state/store";
import { JOB_MAP } from "../../data/jobs";
import { VEHICLE_MAP } from "../../data/vehicles";
import { TOOL_MAP } from "../../data/tools";

export function BayWindow() {
  const activeJobId = useStore((s) => s.activeJobId);
  const stepIndex = useStore((s) => s.stepIndex);
  const activeToolId = useStore((s) => s.activeToolId);
  const findings = useStore((s) => s.findings);
  const repairComplete = useStore((s) => s.repairComplete);
  const performStep = useStore((s) => s.performStep);
  const openWindow = useStore((s) => s.openWindow);
  const [torque, setTorque] = useState("");

  const job = activeJobId ? JOB_MAP[activeJobId] : null;
  if (!job) return <p className="hint">Open a job from the Garage to start work.</p>;

  const v = VEHICLE_MAP[job.vehicleId];
  const step = job.procedure[stepIndex];
  const total = job.procedure.length;

  const toolOk = !step?.requiredToolId || activeToolId === step.requiredToolId;
  const needTool = step?.requiredToolId ? TOOL_MAP[step.requiredToolId] : null;

  return (
    <div>
      <div className="bay-vehicle">
        <span className="em">{v.icon}</span>
        <div>
          <div style={{ fontWeight: 700 }}>{v.name}</div>
          <div className="hint" style={{ margin: 0 }}>{job.title}</div>
        </div>
      </div>

      <div className="step-progress">
        {job.procedure.map((s, i) => (
          <span
            key={s.id}
            className={`pip ${i < stepIndex ? "done" : i === stepIndex ? "current" : ""}`}
          />
        ))}
      </div>

      {repairComplete || !step ? (
        <div className="done-banner">
          ✓ All {total} steps complete.
          <br />
          <button
            className="perform"
            style={{ marginTop: 12 }}
            onClick={() => openWindow("work-order")}
          >
            Open Work Order
          </button>
        </div>
      ) : (
        <div className="step-card">
          <div className="lbl">
            Step {stepIndex + 1} / {total}: {step.label}
          </div>
          <div className="instr">{step.instruction}</div>

          {needTool ? (
            <div className={`need ${toolOk ? "ok" : ""}`}>
              Required tool: <b>{needTool.name}</b>{" "}
              {toolOk ? "✓ selected" : "— select it in the Tools window"}
            </div>
          ) : (
            <div className="need ok">
              <b>No tool required</b> — just perform the action.
            </div>
          )}

          {step.action === "torque" && step.torque && (
            <div className="torque-row">
              <span>Set torque:</span>
              <input
                type="number"
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
                placeholder="value"
              />
              <span>{step.torque.unit}</span>
            </div>
          )}

          <button
            className="perform"
            disabled={!toolOk}
            onClick={() => {
              performStep(step.action === "torque" ? Number(torque) : undefined);
              setTorque("");
            }}
          >
            {step.action === "torque" ? "Apply torque" : "Perform step"}
          </button>

          <div className="hint">💡 {step.hint}</div>
        </div>
      )}

      {findings.length > 0 && (
        <div className="findings">
          <h5>Diagnostic findings</h5>
          {findings.map((f, i) => (
            <div key={i} className={`finding ${f.flag ? "flag" : ""}`}>
              <span>{f.label}</span>
              <span className="val">{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
