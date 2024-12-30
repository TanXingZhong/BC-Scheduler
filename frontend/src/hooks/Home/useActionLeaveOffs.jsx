import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useActionLeaveOffs = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
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

    try {
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
        console.log(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log("Action completed", json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error approve_reject leave/off", error);
    }
  };

  return { approve_reject, isLoading, error };
};
