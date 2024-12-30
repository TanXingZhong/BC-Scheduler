import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
export const useEditSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const editSchedule = async (
    schedule_id,
    outlet_name,
    start_time,
    end_time,
    vacancy
  ) => {
    try {
      const response = await fetch("http://localhost:8080/schedules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          schedule_id,
          outlet_name,
          start_time,
          end_time,
          vacancy,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(json.message || "Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error deleting schedule", error);
      setIsLoading(false);
      setError("Error fetching all roles");
    }
  };

  return { editSchedule, isLoading, error };
};
