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
      setIsLoading(false);
      dispatch({
        type: "GET_DATA",
        payload: { allDatas: json.rows, allRoles: json.allRoles },
      });
    }
  };

  return { getUsersInfo, isLoading, error };
};
