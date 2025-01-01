import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGetWorkingHours = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const getWorkingHours = async (startDate, endDate) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(
      "http://localhost:8080/users/getworkinghours",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          startDate,
          endDate,
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
      return json.rows;
    }
  };

  return { getWorkingHours, isLoading, error, success };
};
