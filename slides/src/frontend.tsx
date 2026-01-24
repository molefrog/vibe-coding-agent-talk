import { createRoot, type Root } from "react-dom/client";
import "./index.css";
import App from "./App";

declare global {
  var __root: Root | undefined;
}

const container = document.getElementById("root")!;

if (!globalThis.__root) {
  globalThis.__root = createRoot(container);
}

globalThis.__root.render(<App />);
