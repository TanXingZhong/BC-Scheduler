import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Calendar from "./pages/Calendar";
import EditSchedule from "./pages/EditSchedule";
import Users from "./pages/Users";
import Dashboard from "./Dashboard";
import HomeGrid from "./components/HomeGrid";

function App() {
  const { user } = useAuthContext();
  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<HomeGrid />} />
        <Route path="signup" element={<Signup />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="edit-schedule" element={<EditSchedule />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="/login" element={!user ? <SignIn /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
