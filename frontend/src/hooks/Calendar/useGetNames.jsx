import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetNames = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const fetchNames = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("http://localhost:8080/employee", {
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
      setSuccess(json.message);
      return json.rows;
    }
  };

  return { fetchNames, isLoading, error, success };
};
