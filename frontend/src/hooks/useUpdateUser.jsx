import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const updateUser = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  return { updateUser, isLoading, error };
};
