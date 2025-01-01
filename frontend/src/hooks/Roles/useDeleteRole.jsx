import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

export const useDeleteRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();

  const deleteRole = async (role_name) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const response = await fetch("http://localhost:8080/roles", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ role_name }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      setIsLoading(false);
      setSuccess(json.message);
    }
  };

  return { deleteRole, isLoading, error, success };
};
