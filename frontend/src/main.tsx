import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "normalize.css";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";
import { DialogProvider } from "./context/DialogContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <DialogProvider>
        <App />
      </DialogProvider>
    </Router>
  </StrictMode>
);
