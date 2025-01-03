import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useClearUserApplication = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const clearApplications = async (application_id, action) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/schedules/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        application_id,
        action,
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

  return { clearApplications, isLoading, error, success };
};
