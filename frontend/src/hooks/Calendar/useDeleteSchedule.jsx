import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
export const useDeleteSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const deleteSchedule = async (schedule_id) => {
    try {
      const response = await fetch("http://localhost:8080/schedules", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ schedule_id }),
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

  return { deleteSchedule, isLoading, error };
};
