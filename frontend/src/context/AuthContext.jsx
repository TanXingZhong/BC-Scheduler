import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

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
  const [state, dispatch] = useReducer(authReducer, {
    user: null, // User initially null, will be loaded on token refresh.
  });
  console.log("AuthContext state:", state);

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/refresh", {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
      });

      if (response.ok) {
        const json = await response.json();

        // Save user to state
        dispatch({ type: "LOGIN", payload: json });
      } else {
        // If the refresh token is invalid or expired
        console.error("Failed to refresh access token");
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      dispatch({ type: "LOGOUT" });
    }
  };

  useEffect(() => {
    // Attempt to refresh token on app load
    if (state.user == null) refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
