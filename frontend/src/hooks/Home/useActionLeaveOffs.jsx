import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useActionLeaveOffs = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const approve_reject = async (
    leave_offs_id,
    user_id,
    type,
    amt_used,
    action
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(
      "http://localhost:8080/users/leaveoffapprovalaction",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          leave_offs_id,
          user_id,
          type,
          amt_used,
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
