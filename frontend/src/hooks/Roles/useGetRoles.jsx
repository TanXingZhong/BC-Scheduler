import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetRoles = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const fetchRoles = async () => {
    const response = await fetch("http://localhost:8080/roles", {
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
      return;
    }
    if (response.ok) {
      setIsLoading(false);
      return json.rows;
    }
  };

  return { fetchRoles, isLoading, error };
};
