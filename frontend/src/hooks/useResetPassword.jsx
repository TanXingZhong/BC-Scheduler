import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useResetPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const resetPasswordHook = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    console.log(data);

    const response = await fetch("http://localhost:8080/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(data),
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

  return { resetPasswordHook, isLoading, error, success };
};
