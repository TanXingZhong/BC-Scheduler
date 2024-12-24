import { useState } from "react";

export const useGetCalendar = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      const response = await fetch("http://localhost:8080/schedules", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(json.message || "Something went wrong");
        return;
      }
      setIsLoading(false);
      return {rows: json.rows, rowsplus: json.rowsplus};
    } catch (error) {
      console.log("Error getRoles", error);
      setIsLoading(false);
      setError("Error fetching all roles");
    }
  };

  return { fetchSchedule, isLoading, error };
};
