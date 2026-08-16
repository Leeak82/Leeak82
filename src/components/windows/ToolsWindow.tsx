import { useStore } from "../../state/store";
import { TOOLS, TOOL_MAP } from "../../data/tools";

export function ToolsWindow() {
  const activeToolId = useStore((s) => s.activeToolId);
  const selectTool = useStore((s) => s.selectTool);
  const active = activeToolId ? TOOL_MAP[activeToolId] : null;

  return (
    <div>
      <div className="active-tool-bar">
        Active tool: <b>{active ? active.name : "none — pick a tool"}</b>
      </div>
      <div className="toolgrid">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`tool ${activeToolId === t.id ? "active" : ""}`}
            title={t.description}
            onClick={() => selectTool(t.id)}
          >
            <div className="em">{t.icon}</div>
            <div className="nm">{t.short}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
