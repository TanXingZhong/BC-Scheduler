import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useAssignEmployee = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const assignEmployee = async (schedule_id, employee_id, employee_email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/schedules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          schedule_id,
          employee_id,
          employee_email,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("Assigned completed", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error assigning employee to schedule", error);
    }
  };

  return { assignEmployee, isLoading, error };
};
