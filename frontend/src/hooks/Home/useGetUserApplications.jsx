import { useState } from "react";

export const useGetUserApplications = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const userApplications = async (user_id) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8080/schedules/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
      }),
    });

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

  return { userApplications, isLoading, error };
};
