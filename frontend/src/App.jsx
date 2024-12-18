import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Calendar from "./pages/Calendar";
import EditSchedule from "./pages/EditSchedule";
import Users from "./pages/Users";
import Dashboard from "./Dashboard";
import HomeGrid from "./components/HomeGrid";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Delete from "./pages/delete";

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
          <Route path="calendar" element={<Calendar />} />
          <Route path="edit-schedule" element={<EditSchedule />} />
          <Route path="users" element={<Users />} />
             <Route
              path="/admin"
              element={user ? <Admin /> : <Navigate to="/admin" />}
            />
                  <Route
              path="/delete"
              element={user ? <Delete /> : <Navigate to="/delete" />}
            />
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
