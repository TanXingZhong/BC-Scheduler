import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";

export const useUserInfo = () => {
  const { user } = useAuthContext();

  if (!user || !user.accessToken) {
    // Handle the case where user or accessToken is unavailable
    return {
      name: "",
      email: "",
    };
  }

  const accessToken = user.accessToken;
  const decoded = jwtDecode(accessToken);

  // Check if UserInfo exists before destructuring
  if (decoded && decoded.UserInfo) {
    const { name, email } = decoded.UserInfo;

    return { name, email };
  }

  // Return default values if decoding fails
  return {
    name: "",
    email: "",
  };
};
