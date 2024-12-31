import { useState } from "react";

export const useClearUserLeaveApplication = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearLeaveApplications = async (
    leave_offs_id,
    user_id,
    type,
    status,
    amt_used
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(
      "http://localhost:8080/users/clearleaveapplication",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leave_offs_id,
          user_id,
          type,
          status,
          amt_used,
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

  return { clearLeaveApplications, isLoading, error, success };
};
