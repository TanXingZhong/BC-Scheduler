import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { user } = useAuthContext();

  const signup = async (name, username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ name, username, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("Account created", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error signing up", error);
    }
  };

  return { signup, isLoading, error };
};
