import { useStore } from "./state/store";
import { Login } from "./components/Login";
import { Desktop } from "./components/Desktop";

export default function App() {
  const user = useStore((s) => s.user);
  return user ? <Desktop /> : <Login />;
}
