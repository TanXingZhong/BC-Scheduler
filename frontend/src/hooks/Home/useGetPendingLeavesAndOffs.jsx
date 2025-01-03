import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useGetPendingLeavesAndOffs = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const getPendingLeavesAndOffs = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/users/leaveoff`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      setIsLoading(false);
      return json.rows;
    }
  };

  return { getPendingLeavesAndOffs, isLoading, error };
};
