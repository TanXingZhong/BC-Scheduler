import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useCreateSchedule = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const createSchedule = async (outlet_name, start_time, end_time, vacancy) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(`${BASE_URL}/schedules`, {
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
      setIsLoading(false);
      setSuccess(json.message);
    }
  };

  return { createSchedule, isLoading, error, success, setError, setSuccess };
};
