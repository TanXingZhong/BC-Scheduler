import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useRemoveUserFromSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const removeUser = async (schedule_id, employee_id) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(`${BASE_URL}/schedules/edit`, {
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
      setError(json.message);
    }

    if (response.ok) {
      setIsLoading(false);
      setSuccess(json.message);
    }
  };

  return { removeUser, isLoading, error, success };
};
