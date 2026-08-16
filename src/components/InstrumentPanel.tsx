import { useEffect, useState } from "react";
import { useStore } from "../state/store";

export function InstrumentPanel() {
  const engineRunning = useStore((s) => s.engineRunning);
  const [rpm, setRpm] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setRpm((prev) => {
        const target = engineRunning ? 800 + Math.random() * 150 : 0;
        return prev + (target - prev) * 0.15;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engineRunning]);

  // Map 0..7000 rpm to -80..80 degrees.
  const angle = -80 + (Math.min(rpm, 7000) / 7000) * 160;

  return (
    <div className="cluster">
      <h4>Instrument Panel</h4>
      <div className="tach">
        <div className="needle" style={{ transform: `rotate(${angle}deg)` }} />
        <div className="rpm">{Math.round(rpm)} RPM · x1000</div>
      </div>
      <div className="warnlights">
        <div className={`warn ${engineRunning ? "" : "on"}`} title="Not running">🔋</div>
        <div className={`warn ${engineRunning ? "" : "on"}`} title="Oil">🛢️</div>
        <div className={`warn ${engineRunning ? "" : "on"}`} title="Check engine">🈁</div>
      </div>
    </div>
  );
}
