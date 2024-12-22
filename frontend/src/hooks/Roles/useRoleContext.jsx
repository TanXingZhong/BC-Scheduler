import { RoleContext } from "../../context/RoleContext";
import { useContext } from "react";

export const useRoleContext = () => {
  const context = useContext(RoleContext);

  if (!context) {
    throw Error("useRolesContext must be used inside an RolesContext.Provider");
  }

  return context;
};
