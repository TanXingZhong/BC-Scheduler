import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const usePutApplication = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const approve_reject = async (schedule_id, user_id, action) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/schedules/application",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            schedule_id,
            user_id,
            action,
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
        console.log("Action completed", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error approve_reject shift", error);
    }
  };

  return { approve_reject, isLoading, error };
};
