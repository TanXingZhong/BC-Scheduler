import { createContext, useReducer } from "react";
export const UserContext = createContext();

export const userReducer = (state, action) => {
  switch (action.type) {
    case "GET_DATA":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
  });

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
