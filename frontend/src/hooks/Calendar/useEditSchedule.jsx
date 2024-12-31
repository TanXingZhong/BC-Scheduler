import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useEditSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const editSchedule = async (
    schedule_id,
    outlet_name,
    start_time,
    end_time,
    vacancy
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

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
      setError(json.message);
    }

    if (response.ok) {
      setIsLoading(false);
      setSuccess(json.message);
    }
  };

  return { editSchedule, isLoading, error, success };
};
