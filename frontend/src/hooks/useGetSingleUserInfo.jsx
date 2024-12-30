import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetSingleUserInfo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const getUserById = async (user_id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("User has been retrieved", json.success);
        setIsLoading(false);
        return json.employee;
      }
    } catch (error) {
      console.log("Error getting user", error);
    }
  };

  return { getUserById, isLoading, error };
};
