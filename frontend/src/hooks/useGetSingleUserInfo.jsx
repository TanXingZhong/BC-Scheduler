import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetSingleUserInfo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const getUserById = async (user_id) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8080/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
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
      return json;
    }
  };

  return { getUserById, isLoading, error };
};
