import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useCreateSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const createSchedule = async (outlet_name, start_time, end_time, vacancy) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          outlet_name,
          start_time,
          end_time,
          vacancy,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("Schedules created", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error creating schedules", error);
    }
  };

  return { createSchedule, isLoading, error };
};
