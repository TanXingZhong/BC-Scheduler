import { useState } from "react";

export const useApplyShift = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const applyShift = async (schedule_id, user_id) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(
      "http://localhost:8080/schedules/application",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schedule_id,
          user_id,
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
      setSuccess(json.message);
    }
  };

  return { applyShift, isLoading, error, success };
};
