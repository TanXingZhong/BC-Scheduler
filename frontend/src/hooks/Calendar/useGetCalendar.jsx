import { useState } from "react";

export const useGetCalendar = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);

  const fetchSchedule = async (start_date) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/schedules/bydate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
