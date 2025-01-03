import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useUserContext } from "./useUserContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useGetUsersInfo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useUserContext();

  const getUsersInfo = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/users`, {
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
