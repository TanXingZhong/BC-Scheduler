import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { Box, CircularProgress, styled } from "@mui/material";
import ProtectedRoute from "./routes/protectedRoutes";
// import { lazy, Suspense } from "react";

// Lazy-loaded components
import Dashboard from "./Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminCalendar from "./pages/AdminCalendar";
import MyCalendar from "./pages/MyCalendar";
import LeavesAndOffs from "./pages/LeavesAndOffs";
import Users from "./pages/Users";
import HomeGrid from "./components/Home/HomeGrid";
import Roles from "./pages/Roles";
import ChangePassword from "./pages/ChangePassword";
import YearlyCountdown from "./pages/YearlyCountDown";
import { useUserInfo } from "./hooks/useUserInfo";

// export const Dashboard = lazy(() => import("./Dashboard"));
// export const SignIn = lazy(() => import("./pages/SignIn"));
// export const SignUp = lazy(() => import("./pages/SignUp"));
// export const AdminCalendar = lazy(() => import("./pages/AdminCalendar"));
// export const MyCalendar = lazy(() => import("./pages/MyCalendar"));
// export const Users = lazy(() => import("./pages/Users"));
// export const HomeGrid = lazy(() => import("./components/Home/HomeGrid"));
// export const Roles = lazy(() => import("./pages/Roles"));

const CenteredBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
}));

const renderFallback = (
  <CenteredBox>
    <CircularProgress />
  </CenteredBox>
);

function App() {
  const { user } = useAuthContext();
  const { admin } = useUserInfo();
  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<HomeGrid />} />
        <Route path="calendar" element={<MyCalendar />} />
        <Route path="leaves" element={<LeavesAndOffs />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route
          path="edit-schedule"
          element={
            <ProtectedRoute user={user} isAdmin={admin}>
              <AdminCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute user={user} isAdmin={admin}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="signup"
          element={
            <ProtectedRoute user={user} isAdmin={admin}>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute user={user} isAdmin={admin}>
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="yearly-countdown"
          element={
            <ProtectedRoute user={user} isAdmin={admin}>
              <YearlyCountdown />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={!user ? <SignIn /> : <Navigate to="/" />} />
      <Route
        path="*"
        element={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <h1>404 - Page Not Found</h1>
          </Box>
        }
      />
    </Routes>
  );
}

export default App;
