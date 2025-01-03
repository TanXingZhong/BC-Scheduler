import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetMonthLeaveOffs = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const monthLeaveOffs = async (startDate) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "http://localhost:8080/users/getMonthLeaveOffs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          startDate,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
      return;
    }
    if (response.ok) {
      setIsLoading(false);
      return json.rows;
    }
  };

  return { monthLeaveOffs, isLoading, error };
};
