import { createContext, useReducer } from "react";
export const RoleContext = createContext();

export const roleReducer = (state, action) => {
  switch (action.type) {
    case "GET_ROLES":
      return { ...state, roles: action.payload };
    default:
      return state;
  }
};

export const RoleContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roleReducer, {
    roles: null,
  });

  return (
    <RoleContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoleContext.Provider>
  );
};
