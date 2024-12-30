import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
export const useRemoveUserFromSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const removeUser = async (schedule_id, employee_id) => {
    try {
      const response = await fetch("http://localhost:8080/schedules/edit", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ schedule_id, employee_id }),
      });

      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(json.message || "Something went wrong");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error deleting user from schedule", error);
      setIsLoading(false);
      setError("Error deleting user from schedle", error);
    }
  };

  return { removeUser, isLoading, error };
};
