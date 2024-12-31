import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const usePutApplication = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const { user } = useAuthContext();

  const approve_reject = async (schedule_id, user_id, action) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(
      "http://localhost:8080/schedules/application",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          schedule_id,
          user_id,
          action,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      setIsLoading(false);
      setSuccess(null);
    }
  };

  return { approve_reject, isLoading, error, success };
};
