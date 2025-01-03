import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useCreateAdd = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const { user } = useAuthContext();

  const createAdd = async (
    outlet_name,
    start_time,
    end_time,
    vacancy,
    user_id
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/schedules/createAdd", {
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
        user_id,
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

  return { createAdd, isLoading, error, success, setError, setSuccess };
};
