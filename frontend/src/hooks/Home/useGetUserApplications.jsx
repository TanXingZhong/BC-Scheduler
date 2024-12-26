import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetUserApplications = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const userApplications = async (user_id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/schedules/user", {
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
        return;
      }
      if (response.ok) {
        // update loading state
        setIsLoading(false);
        return json.rows;
      }
    } catch (error) {
      console.log("Error getting user applications", error);
    }
  };

  return { userApplications, isLoading, error };
};
