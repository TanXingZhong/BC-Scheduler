import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLeaveOffApps = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const leaveOffApply = async (
    user_id,
    type,
    startDate,
    endDate,
    duration,
    amt_used
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/users/leaveoffapply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        user_id,
        type,
        startDate,
        endDate,
        duration,
        amt_used,
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

  return { leaveOffApply, isLoading, error, success };
};
