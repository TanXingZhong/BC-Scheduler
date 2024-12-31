import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";

export const useUserInfo = () => {
  const { user } = useAuthContext();

  if (!user || !user.accessToken) {
    return {
      name: "",
      user_id: "",
      email: "",
      role_id: "",
      admin: false,
      leaves: -1,
      offs: -1,
      userShifts: [],
    };
  }

  const accessToken = user.accessToken;
  const decoded = jwtDecode(accessToken);
  if (decoded && decoded.UserInfo) {
    const { name, user_id, email, role_id, admin, leaves, offs, userShifts } =
      decoded.UserInfo;

    return { name, user_id, email, role_id, admin, leaves, offs, userShifts };
  }

  return {
    name: "",
    user_id: "",
    email: "",
    role_id: "",
    admin: false,
    leaves: -1,
    offs: -1,
    userShifts: [],
  };
};
