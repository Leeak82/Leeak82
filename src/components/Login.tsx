import { useState } from "react";
import { useStore } from "../state/store";

export function Login() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);
  const authError = useStore((s) => s.authError);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register") register(username, password);
    else login(username, password);
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="brand">
          <span className="logo">🔧</span>
          <div>
            <h1>GearShift Garage</h1>
          </div>
        </div>
        <p className="tag">
          Automotive repair simulator — diagnose, repair to OEM/ASE spec, and level up.
        </p>

        <label className="field">
          <label>Technician username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. rev_wrench"
            autoFocus
          />
        </label>
        <label className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </label>

        <div className="auth-error">{authError}</div>

        <button className="btn" type="submit">
          {mode === "register" ? "Create tech account" : "Clock in"}
        </button>

        <div className="auth-toggle">
          {mode === "register" ? (
            <>
              Already have an account?{" "}
              <a onClick={() => setMode("login")}>Log in</a>
            </>
          ) : (
            <>
              New here?{" "}
              <a onClick={() => setMode("register")}>Create an account</a>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
