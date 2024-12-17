import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
import { BrowserRouter } from "react-router-dom";

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      {/* <BrowserRouter>
  
      </BrowserRouter> */}
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
