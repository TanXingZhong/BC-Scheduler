import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useUserContext } from "./useUserContext";

export const useGetUsersInfo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useUserContext();

  const getUsersInfo = async () => {
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
      if (!response.ok) {
        setIsLoading(false);
        setError(json.message);
      }
      if (response.ok) {
        // update loading state
        setIsLoading(false);
        dispatch({
          type: "GET_DATA",
          payload: json.rows,
        });
      }
    } catch (error) {
      console.log("Error getting userData", error);
    }
  };

  return { getUsersInfo, isLoading, error };
};
