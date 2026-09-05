import React from "react";
import ReactDOM from "react-dom/client";

import App from "@app/App";
import { AuthProvider } from "@store/auth/AuthContext";

import "@lib/axios"; // ensure axios instance is configured
import "@services/api/interceptors"; // register request/response interceptors
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#13251d",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);