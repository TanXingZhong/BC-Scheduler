import { useState } from "react";

export const useGetRoles = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = async () => {
    const response = await fetch("http://localhost:8080/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

  return { fetchRoles, isLoading, error };
};
