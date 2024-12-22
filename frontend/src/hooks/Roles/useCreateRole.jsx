import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useCreateRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const createRole = async (role_name) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ role_name }),
      });
      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error updating role", error);
    }
  };

  return { createRole, isLoading, error };
};
