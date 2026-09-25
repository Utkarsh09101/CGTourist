import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/public/Home';
import ExploreDestinations from './pages/public/ExploreDestinations';
import DestinationDetails from './pages/public/DestinationDetails';
import FindGuides from './pages/public/FindGuides';
import GuideDetails from './pages/public/GuideDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Tourist Pages
import TouristDashboard from './pages/tourist/TouristDashboard';
import MyRequests from './pages/tourist/MyRequests';
import WriteReview from './pages/tourist/WriteReview';

// Guide Pages
import GuideDashboard from './pages/guide/GuideDashboard';
import IncomingRequests from './pages/guide/IncomingRequests';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public and Protected Views under MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="destinations" element={<ExploreDestinations />} />
            <Route path="destinations/:slug" element={<DestinationDetails />} />
            <Route path="guides" element={<FindGuides />} />
            <Route path="guides/:id" element={<GuideDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            {/* Tourist Protected Routes */}
            <Route
              path="tourist/dashboard"
              element={
                <ProtectedRoute allowedRoles={['tourist']}>
                  <TouristDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="tourist/requests"
              element={
                <ProtectedRoute allowedRoles={['tourist']}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="tourist/write-review/:requestId"
              element={
                <ProtectedRoute allowedRoles={['tourist']}>
                  <WriteReview />
                </ProtectedRoute>
              }
            />

            {/* Guide Protected Routes */}
            <Route
              path="guide/dashboard"
              element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <GuideDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="guide/requests"
              element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <IncomingRequests />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
