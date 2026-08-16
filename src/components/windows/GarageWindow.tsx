import { useStore } from "../../state/store";
import { JOBS } from "../../data/jobs";
import { VEHICLE_MAP } from "../../data/vehicles";

export function GarageWindow() {
  const startJob = useStore((s) => s.startJob);
  const user = useStore((s) => s.user);
  const activeJobId = useStore((s) => s.activeJobId);

  return (
    <div className="jobgrid">
      {JOBS.map((job) => {
        const v = VEHICLE_MAP[job.vehicleId];
        const done = user?.completedJobIds.includes(job.id);
        return (
          <div key={job.id} className={`jobcard ${done ? "done" : ""}`}>
            <div className="vh">
              <span className="em">{v.icon}</span>
              <div>
                <div className="nm">{v.name}</div>
                <div className="sub">{v.blurb}</div>
              </div>
            </div>
            <div className="title">{job.title}</div>
            <div className="complaint">“{job.complaint}”</div>
            <div className="foot">
              <span className={`chip ${job.difficulty}`}>{job.difficulty}</span>
              <span className="chip">+{job.xpReward} XP</span>
            </div>
            {done && <div className="done-badge">✓ Completed — replay for 25% XP</div>}
            <button className="startbtn" onClick={() => startJob(job.id)}>
              {activeJobId === job.id ? "Resume RO" : "Open Repair Order"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
