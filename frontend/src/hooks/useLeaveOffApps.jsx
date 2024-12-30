import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLeaveOffApps = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const leaveOffApply = async (
    user_id,
    type,
    startDate,
    endDate,
    duration,
    amt_used
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/users/leaveoffapply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
            type,
            startDate,
            endDate,
            duration,
            amt_used,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("Leave/Off Applied Success", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error signing up", error);
    }
  };

  return { leaveOffApply, isLoading, error };
};
