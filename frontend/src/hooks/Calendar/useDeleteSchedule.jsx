import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useDeleteSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const deleteSchedule = async (schedule_id) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(`${BASE_URL}/schedules`, {
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

    if (response.ok) {
      setIsLoading(false);
      setSuccess(json.message);
    }
  };

  return { deleteSchedule, isLoading, error, success };
};
