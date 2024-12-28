import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";

export const useUserInfo = () => {
  const { user } = useAuthContext();

  if (!user || !user.accessToken) {
    // Handle the case where user or accessToken is unavailable
    return {
      name: "",
      user_id: "",
      email: "",
      role_id: "",
      admin: false,
      leaves: -1,
      userShifts: [],
    };
  }

  const accessToken = user.accessToken;
  const decoded = jwtDecode(accessToken);

  // Check if UserInfo exists before destructuring
  if (decoded && decoded.UserInfo) {
    const { name, user_id, email, role_id, admin, leaves, userShifts } =
      decoded.UserInfo;

    return { name, user_id, email, role_id, admin, leaves, userShifts };
  }

  // Return default values if decoding fails
  return {
    name: "",
    user_id: "",
    email: "",
    role_id: "",
    admin: false,
    leaves: -1,
    userShifts: [],
  };
};
