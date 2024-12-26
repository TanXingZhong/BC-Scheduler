import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useGetAllApplications = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const allApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/schedules/application",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          Authorization: `Bearer ${user.accessToken}`,
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
        return;
      }
      if (response.ok) {
        // update loading state
        setIsLoading(false);
        return json.rows;
      }
    } catch (error) {
      console.log("Error applying for a shift", error);
    }
  };

  return { allApplications, isLoading, error };
};
