import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Dashboard from "./Dashboard";
import HomeGrid from "./components/HomeGrid";

function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        >
          <Route index element={<HomeGrid />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route
          path="/login"
          element={!user ? <SignIn /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
