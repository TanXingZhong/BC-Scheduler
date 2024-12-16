import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useDeleteUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const { user } = useAuthContext();

  const deleteUser = async (username, password, roles, active) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const json = await response.json();
      console.log(json.rows);

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

  return { deleteUser , isLoading, error };
};
