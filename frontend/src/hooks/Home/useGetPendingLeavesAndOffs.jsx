import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetPendingLeavesAndOffs = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const getPendingLeavesAndOffs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/users/leaveoff", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        console.log(
          "All Pending Leaves and Offs have been retrieved",
          json.success
        );
        setIsLoading(false);
        return json.rows;
      }
    } catch (error) {
      console.log("Error getting user", error);
    }
  };

  return { getPendingLeavesAndOffs, isLoading, error };
};
