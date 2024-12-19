import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useDeleteUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const deleteUser = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ email }),
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
      console.log("Error Deleting user", error);
    }
  };

  return { deleteUser, isLoading, error };
};
