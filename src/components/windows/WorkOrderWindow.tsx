import { useStore } from "../../state/store";
import { JOB_MAP } from "../../data/jobs";

export function WorkOrderWindow() {
  const activeJobId = useStore((s) => s.activeJobId);
  const user = useStore((s) => s.user);
  const wo = useStore((s) => s.workOrder);
  const setWorkOrder = useStore((s) => s.setWorkOrder);
  const togglePart = useStore((s) => s.togglePart);
  const submitWorkOrder = useStore((s) => s.submitWorkOrder);
  const repairComplete = useStore((s) => s.repairComplete);

  const job = activeJobId ? JOB_MAP[activeJobId] : null;
  if (!job) return <p className="hint">No active job.</p>;

  return (
    <div>
      <div className="ro-head">
        <span className="ro-num">{job.roNumber} · Work Order</span>
        <span className="chip">Tech: {user?.username}</span>
      </div>

      {!repairComplete && (
        <div className="toast info" style={{ position: "static", transform: "none", marginBottom: 12 }}>
          Finish all steps in the Service Bay before this work order can be signed off.
        </div>
      )}

      <div className="wo-section">
        <h4>Complaint</h4>
        <div className="concern">{job.complaint}</div>
      </div>

      <div className="wo-section">
        <h4>Cause</h4>
        {job.workOrder.causes.map((c) => (
          <label className="opt" key={c.id}>
            <input
              type="radio"
              name="cause"
              checked={wo.causeId === c.id}
              onChange={() => setWorkOrder({ causeId: c.id })}
            />
            <span>{c.text}</span>
          </label>
        ))}
      </div>

      <div className="wo-section">
        <h4>Correction</h4>
        {job.workOrder.corrections.map((c) => (
          <label className="opt" key={c.id}>
            <input
              type="radio"
              name="correction"
              checked={wo.correctionId === c.id}
              onChange={() => setWorkOrder({ correctionId: c.id })}
            />
            <span>{c.text}</span>
          </label>
        ))}
      </div>

      <div className="wo-section">
        <h4>Parts used</h4>
        {job.workOrder.parts.map((p) => (
          <label className="opt" key={p.id}>
            <input
              type="checkbox"
              checked={wo.partIds.includes(p.id)}
              onChange={() => togglePart(p.id)}
            />
            <span>
              <b>{p.number}</b> — {p.name}
            </span>
          </label>
        ))}
      </div>

      <div className="wo-section">
        <h4>Labor</h4>
        <div className="labor-row">
          <span>Hours:</span>
          <input
            type="number"
            step="0.1"
            value={wo.laborHours}
            onChange={(e) => setWorkOrder({ laborHours: e.target.value })}
            placeholder="0.0"
          />
          <span className="hint" style={{ margin: 0 }}>flat-rate guide applies</span>
        </div>
      </div>

      <div className="wo-section">
        <h4>Diagnosis &amp; work performed</h4>
        <textarea
          value={wo.diagnosis}
          onChange={(e) => setWorkOrder({ diagnosis: e.target.value })}
          placeholder="Document the 3 C's: what you found and the repair performed..."
        />
      </div>

      <div className="wo-section checklist">
        <h4>Sign-off checklist</h4>
        <label>
          <input
            type="checkbox"
            checked={wo.checklist.resolved}
            onChange={(e) =>
              setWorkOrder({ checklist: { ...wo.checklist, resolved: e.target.checked } })
            }
          />
          Failure resolved
        </label>
        <label>
          <input
            type="checkbox"
            checked={wo.checklist.verified}
            onChange={(e) =>
              setWorkOrder({ checklist: { ...wo.checklist, verified: e.target.checked } })
            }
          />
          Verified repair — vehicle is ready
        </label>
        <label>
          <input
            type="checkbox"
            checked={wo.checklist.documented}
            onChange={(e) =>
              setWorkOrder({ checklist: { ...wo.checklist, documented: e.target.checked } })
            }
          />
          Diagnosis &amp; work documented
        </label>
      </div>

      <button className="submit-wo" onClick={submitWorkOrder}>
        Sign off &amp; submit work order
      </button>
    </div>
  );
}
