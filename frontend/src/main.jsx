import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StyledEngineProvider } from "@mui/material/styles";
import { AuthContextProvider } from "./context/AuthContext";
import { UserContextProvider } from "./context/UserContext";
import { RoleContextProvider } from "./context/RoleContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <AuthContextProvider>
        <UserContextProvider>
          <RoleContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RoleContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </StyledEngineProvider>
  </StrictMode>
);
