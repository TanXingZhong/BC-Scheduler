import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetPendingLeavesAndOffs = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const getPendingLeavesAndOffs = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8080/users/leaveoff", {
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
