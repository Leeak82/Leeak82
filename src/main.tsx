import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { restoreSession } from "./state/store";
import "./styles.css";

restoreSession();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
