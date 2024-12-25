import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useApplyShift = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const applyShift = async (schedule_id, user_id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/schedules/application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule_id,
            user_id,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
        console.log(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("Apply completed", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error applying for a shift", error);
    }
  };

  return { applyShift, isLoading, error };
};
