import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useClearUserApplication = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const clearApplications = async (application_id, action) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/schedules/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id,
          action,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error getting user applications", error);
    }
  };

  return { clearApplications, isLoading, error };
};
