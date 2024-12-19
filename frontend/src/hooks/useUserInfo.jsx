import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";

export const useUserInfo = () => {
  let is_FullTimer = false;
  let isAdmin = false;
  let status = "Part_timer";

  const { user } = useAuthContext();

  if (!user || !user.accessToken) {
    // Handle the case where user or accessToken is unavailable
    return {
      name: "",
      email: "",
      roles: [],
      status: "Part_timer",
      is_FullTimer,
      isAdmin,
    };
  }

  const accessToken = user.accessToken;
  const decoded = jwtDecode(accessToken);

  // Check if UserInfo exists before destructuring
  if (decoded && decoded.UserInfo) {
    const { name, email, roles } = decoded.UserInfo;

    is_FullTimer = roles.includes("Full_timer");
    isAdmin = roles.includes("Admin");

    if (is_FullTimer) status = "Full_timer";
    if (isAdmin) status = "Admin";

    return { name, email, roles, status, is_FullTimer, isAdmin };
  }

  // Return default values if decoding fails
  return {
    name: "",
    email: "",
    roles: [],
    status: "Part_timer",
    is_FullTimer,
    isAdmin,
  };
};
