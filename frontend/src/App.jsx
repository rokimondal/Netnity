import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import NotificationPage from "./pages/NotificationPage";
import OnboardingPage from "./pages/OnboardingPage";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";
import ProfileUpdate from "./pages/ProfileUpdate";
import ForgetPassword from "./pages/ForgetPassword";

export default function App() {

  const { theme } = useThemeStore();
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticate = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={isAuthenticate && isOnboarded ? (<Layout showSidebar={true}><HomePage /></Layout>) : (<Navigate to={isAuthenticate ? "/onboarding" : "/login"} />)} />
        <Route
          path="/login"
          element={!isAuthenticate ? <LoginPage /> : (<Navigate to={isOnboarded ? "/" : "/onboarding"} />)} />
        <Route
          path="/signup"
          element={!isAuthenticate ? <SignUpPage /> : (<Navigate to={isOnboarded ? "/" : "/onboarding"} />)} />
        <Route
          path="/chat/:id"
          element={isAuthenticate && isOnboarded ? <Layout showSidebar={false}><ChatPage /> </Layout> : <Navigate to={!isAuthenticate ? "/login" : "/onboarding"} />} />
        <Route
          path="/call/:id"
          element={isAuthenticate && isOnboarded ? <CallPage /> : <Navigate to={!isAuthenticate ? "/login" : "/onboarding"} />} />
        <Route
          path="/notifications"
          element={isAuthenticate && isOnboarded ? <Layout showSidebar={true}><NotificationPage /></Layout> : <Navigate to={!isAuthenticate ? "/login" : "/onboarding"} />} />
        <Route
          path="/forgot-password"
          element={isAuthenticate && isOnboarded ? <Layout showSidebar={false}><ForgetPassword /></Layout> : <Navigate to={!isAuthenticate ? "/login" : "/onboarding"} />} />
        <Route
          path="/onboarding"
          element={isAuthenticate && !isOnboarded ? <OnboardingPage /> : <Navigate to={isAuthenticate ? "/" : "/login"} />} />
        <Route path="/edit-profile" element={isAuthenticate && isOnboarded ? <Layout showSidebar={false}><ProfileUpdate /></Layout> : <Navigate to={!isAuthenticate ? "/login" : "/onboarding"} />} />
      </Routes>
      <Toaster />
    </div>
  )
}