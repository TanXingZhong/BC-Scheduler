import { useState } from "react";
import { useAuthContext } from "../useAuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;
export const useGetUserLeaveApplications = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const userLeaveApplications = async (user_id) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/users/appliedleaves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        user_id,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
      return;
    }
    if (response.ok) {
      setIsLoading(false);
      return json.rows;
    }
  };

  return { userLeaveApplications, isLoading, error };
};
