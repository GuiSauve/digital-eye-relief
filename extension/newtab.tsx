import React from "react";
import { createRoot } from "react-dom/client";
import { NewTabPage } from "../client/src/components/extension/NewTabPage";
import "../client/src/index.css";

function NewTabApp() {
  return <NewTabPage />;
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<NewTabApp />);
}
