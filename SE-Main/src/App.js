import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PerformanceHistory from "./pages/PerformanceHistory";
import Contests from "./pages/Contests";
import PhotoGalleries from "./pages/PhotoGalleries";
import FundsWithdrawal from "./pages/FundsWithdrawal";
import PhotoCapture from "./pages/PhotoCapture";
import Profile from "./pages/Profile";
import MyInfo from "./pages/MyInfo";
import ExploreContent from "./pages/ExploreContent";
import InviteCreators from "./pages/InviteCreators";
import MyWallet from "./pages/MyWallet";
import Signup from "./pages/Signup";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import VotingPanel from "./pages/VotingPanel";
import Notifications from "./pages/Notifications";
import CrowdCash from "./pages/CrowdCash";
import GalleryPurchase from "./pages/GalleryPurchase";
import DashboardCreator from "./components/DashboardCreator";
import { Navigate } from "react-router-dom";
import PhotoVotingPage from "./components/PhotoVotingPage";
import Conditions from "./pages/Terms&Conditions";
import Faq from "./pages/Faq";
import SmokeSignalDashboard from "./pages/SmokeSignal";
import FavoritedImages from "./pages/FavoritedImages";
import FavoritedGalleries from "./pages/FavoritedGalleries";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

function App() {
  return (
    <Router>
      <PWAInstallPrompt />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance-history"
          element={
            <ProtectedRoute>
              <PerformanceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contests"
          element={
            <ProtectedRoute>
              <Contests />
            </ProtectedRoute>
          }
        />
        <Route
  path="/vote/:contestId"
  element={
    <ProtectedRoute>
      <PhotoVotingPage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/photo-galleries"
          element={
            <ProtectedRoute>
              <PhotoGalleries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funds-withdrawal"
          element={
            <ProtectedRoute>
              <FundsWithdrawal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photo-capture"
          element={
            <ProtectedRoute>
              <PhotoCapture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery-purchase"
          element={
            <ProtectedRoute>
              <GalleryPurchase />
            </ProtectedRoute>
          }
        />
        <Route
  path="/creator-dashboard"
  element={
    <ProtectedRoute>
      <DashboardCreator />
    </ProtectedRoute>
  }
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-info"
          element={
            <ProtectedRoute>
              <MyInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore-content"
          element={
            <ProtectedRoute>
              <ExploreContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite-creators"
          element={
            <ProtectedRoute>
              <InviteCreators />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-wallet"
          element={
            <ProtectedRoute>
              <MyWallet />
            </ProtectedRoute>
          }
        />
          <Route
          path="/crowd_cash"
          element={
            <ProtectedRoute>
              <CrowdCash />
            </ProtectedRoute>
          }
        />
          <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faqs"
          element={
            <ProtectedRoute>
              <Faq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conditions"
          element={
            <ProtectedRoute>
              <Conditions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voting-panel"
          element={
            <ProtectedRoute>
              <VotingPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/smoke-signal" element={<SmokeSignalDashboard/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>

        <Route
          path="/verification"
          element={
            <ProtectedRoute>
              <TwoFactorAuth />
            </ProtectedRoute>
          }
        />

        {/* Favorited Content Routes */}
        <Route
          path="/favorited-images"
          element={
            <ProtectedRoute>
              <FavoritedImages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorited-galleries"
          element={
            <ProtectedRoute>
              <FavoritedGalleries />
            </ProtectedRoute>
          }
        />

        {/* Default redirect or 404 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
<Route
  path="*"
  element={<div className="p-6 text-gray-600">Page Not Found</div>}
/>
      </Routes>
    </Router>
  );
}

export default App;
