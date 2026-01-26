import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import ContestDashboard from './components/ContestDashboard';
import Events from './components/events/Events';
import EventDetail from './components/events/EventDetail';
import RoadmapList from './components/roadmap/RoadmapList';
import RoadmapDetail from './components/roadmap/RoadmapDetail';
import DSASheet from './components/dsa/DSASheet';
import DSATopicDetail from './components/dsa/DSATopicDetail';
import ChallengesList from './components/challenges/ChallengesList';
import ChallengeDetail from './components/challenges/ChallengeDetail';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, userData, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  if (!currentUser) return <Navigate to="/" />;

  if (requireAdmin && !userData?.isAdmin) {
    console.warn("Access denied: User is not an admin. Missing 'isAdmin: true' in Firestore.");
    return <Navigate to="/" />; // Or a 403 page
  }

  return children;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
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
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <ContestDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={<Events />}
      />
      <Route
        path="/events/:eventId"
        element={<EventDetail />}
      />
      <Route
        path="/roadmaps"
        element={<RoadmapList />}
      />
      <Route
        path="/roadmaps/:roadmapId"
        element={<RoadmapDetail />}
      />
      <Route
        path="/dsa-sheet"
        element={<DSASheet />}
      />
      <Route
        path="/dsa-sheet/:topicId"
        element={<DSATopicDetail />}
      />
      <Route
        path="/challenges"
        element={<ChallengesList />}
      />
      <Route
        path="/challenges/:challengeId"
        element={<ChallengeDetail />}
      />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
