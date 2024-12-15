import { useState, useEffect } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  // const fetchData = async () => {
  //   const response = await fetch("http://localhost:8080");
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log(data.fruits);
  //   } else {
  //     console.error("Failed to fetch data:", response.status);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f9",
      }}
    >
      <div
        style={{
          width: "300px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1>{isLogin ? "Login" : "Register"}</h1>

        {/* Login Form */}
        {isLogin && (
          <form>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        )}

        {/* Register Form */}
        {!isLogin && (
          <form>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </form>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLogin ? "Go to Register" : "Go to Login"}
        </button>
      </div>
    </div>
  );
};
export default Login;
