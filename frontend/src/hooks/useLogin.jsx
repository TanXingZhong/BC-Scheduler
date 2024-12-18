import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { jwtDecode } from "jwt-decode";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    let is_FullTimer = false;
    let isAdmin = false;
    let status = "Part_timer";

    try {
      const response = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Required to include cookies in the request
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update the auth context
        const decoded = jwtDecode(json.accessToken);
        const { name, username, roles } = decoded.UserInfo;
        is_FullTimer = roles.includes("Full_timer");
        isAdmin = roles.includes("Admin");

        if (is_FullTimer) status = "Full_timer";
        if (isAdmin) status = "Admin";

        dispatch({
          type: "LOGIN",
          payload: { name, username, roles, status, is_FullTimer, isAdmin },
        });
        // update loading state
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error auth", error);
      setError(error);
    }
  };

  return { login, isLoading, error };
};
