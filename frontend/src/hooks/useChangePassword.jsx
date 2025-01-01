import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useChangePassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const changePassword = async (
    user_id,
    oldPassword,
    newPassword,
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        user_id : user_id,
        oldPassword : oldPassword,
        newPassword : newPassword,
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

  return { changePassword, isLoading, error, success };
};
