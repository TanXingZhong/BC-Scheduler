import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { user } = useAuthContext();

  const updateUser = async (username, password, roles, active) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ username, password, roles, active }),
      });

      const json = await response.json();



      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log(json.success);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error updating user", error);
    }
  }

  return { updateUser, isLoading, error };
};
