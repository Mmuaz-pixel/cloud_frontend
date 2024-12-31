
// Main App Component
import VideoGallery from "./components/VideoGallery";
import Register from "./components/Registration";
import Login from "./components/Login";
import VideoUpload from "./components/VideoUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={
            <ProtectedRoute>
              <VideoUpload />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <VideoGallery />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;