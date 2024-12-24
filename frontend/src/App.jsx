import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { lazy, Suspense } from "react";
import { Box, CircularProgress, styled } from "@mui/material";

// Lazy-loaded components
export const Dashboard = lazy(() => import("./Dashboard"));
export const SignIn = lazy(() => import("./pages/SignIn"));
export const SignUp = lazy(() => import("./pages/SignUp"));
export const MyCalendar = lazy(() => import("./pages/MyCalendar"));
export const EditSchedule = lazy(() => import("./pages/EditSchedule"));
export const Users = lazy(() => import("./pages/Users"));
export const HomeGrid = lazy(() => import("./components/Home/HomeGrid"));
export const Roles = lazy(() => import("./pages/Roles"));

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
  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Suspense fallback={renderFallback}>
              <Dashboard />
            </Suspense>
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<HomeGrid />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="calendar" element={<MyCalendar />} />
        <Route path="edit-schedule" element={<EditSchedule />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
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
