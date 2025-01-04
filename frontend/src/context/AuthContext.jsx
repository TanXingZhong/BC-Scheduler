import { createContext, useReducer, useEffect } from "react";
export const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  console.log("BASE_URL", BASE_URL);

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({
          type: "LOGIN",
          payload: json,
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    if (state.user == null) refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
