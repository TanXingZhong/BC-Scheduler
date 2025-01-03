import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetCalendar = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const fetchSchedule = async (start_date) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/schedules/bydate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ start_date }),
    });

    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
      return;
    }

    if (response.ok) {
      setIsLoading(false);
      setSuccess(json.message);
      return { rows: json.rows, rowsplus: json.rowsplus };
    }
  };

  return { fetchSchedule, isLoading, error, success };
};
