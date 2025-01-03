import { useAuthContext } from "./useAuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
