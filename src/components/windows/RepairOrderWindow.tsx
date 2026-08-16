import { useStore } from "../../state/store";
import { JOB_MAP } from "../../data/jobs";
import { VEHICLE_MAP } from "../../data/vehicles";

export function RepairOrderWindow() {
  const activeJobId = useStore((s) => s.activeJobId);
  const user = useStore((s) => s.user);
  const job = activeJobId ? JOB_MAP[activeJobId] : null;

  if (!job) return <p className="hint">Open a job from the Garage to view its repair order.</p>;
  const v = VEHICLE_MAP[job.vehicleId];

  return (
    <div>
      <div className="ro-head">
        <span className="ro-num">{job.roNumber}</span>
        <span className="chip">{new Date().toLocaleDateString()}</span>
      </div>
      <div className="ro-field">
        <div className="k">Customer</div>
        <div className="v">{job.customer}</div>
      </div>
      <div className="ro-field">
        <div className="k">Vehicle</div>
        <div className="v">
          {v.name} {v.year ? "" : "(no year)"} · {v.make} {v.model}
        </div>
      </div>
      <div className="ro-field">
        <div className="k">Odometer</div>
        <div className="v">{job.mileage.toLocaleString()} mi</div>
      </div>
      <div className="ro-field">
        <div className="k">Assigned technician</div>
        <div className="v">{user?.username}</div>
      </div>
      <div className="ro-field">
        <div className="k">Customer concern (complaint)</div>
        <div className="concern">{job.complaint}</div>
      </div>
      <div className="ro-field">
        <div className="k">Requested service</div>
        <div className="v">{job.requestedService}</div>
      </div>
    </div>
  );
}
