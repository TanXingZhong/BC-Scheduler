import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required to include cookies in the request
      });

      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText);
        return;
      } else {
        console.log(response);
      }
      // dispatch logout action
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return { logout };
};
