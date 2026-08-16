import { Rnd } from "react-rnd";
import type { ReactNode } from "react";
import { useStore, type WindowId } from "../state/store";

interface Props {
  id: WindowId;
  title: string;
  icon: string;
  children: ReactNode;
}

export function Window({ id, title, icon, children }: Props) {
  const win = useStore((s) => s.windows[id]);
  const focusWindow = useStore((s) => s.focusWindow);
  const closeWindow = useStore((s) => s.closeWindow);
  const minimizeWindow = useStore((s) => s.minimizeWindow);
  const setWindowRect = useStore((s) => s.setWindowRect);

  if (!win.open || win.minimized) return null;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      minWidth={320}
      minHeight={200}
      bounds="parent"
      style={{ zIndex: win.z }}
      dragHandleClassName="titlebar"
      onDragStart={() => focusWindow(id)}
      onMouseDown={() => focusWindow(id)}
      onDragStop={(_e, d) => setWindowRect(id, { x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        setWindowRect(id, {
          w: ref.offsetWidth,
          h: ref.offsetHeight,
          x: pos.x,
          y: pos.y,
        })
      }
    >
      <div className="window">
        <div className="titlebar">
          <span className="t-ico">{icon}</span>
          <span className="t-name">{title}</span>
          <button
            className="win-btn"
            title="Minimize"
            onClick={() => minimizeWindow(id)}
          >
            —
          </button>
          <button
            className="win-btn close"
            title="Close"
            onClick={() => closeWindow(id)}
          >
            ✕
          </button>
        </div>
        <div className="body">{children}</div>
      </div>
    </Rnd>
  );
}
