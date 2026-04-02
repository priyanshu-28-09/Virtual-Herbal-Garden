import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ManageContent from "./AdminDashboard/ManageContent";

import Navbar from "./UserInterface/Components/Navbar";
import Navigation from "./AdminDashboard/components/Navigation";
import Footer from "./UserInterface/Components/Footer";
import Login from "./UserInterface/Routes/LoginPages/Login";
import Register from "./UserInterface/Routes/LoginPages/Register";
import Reset from "./UserInterface/Routes/LoginPages/Reset";
import Home from "./UserInterface/Routes/Home";
import About from "./UserInterface/Routes/About";
import VirtualTour from "./VirtualTour";
import Story from "./UserInterface/Routes/Story";
import Bookmarks from "./UserInterface/Routes/Bookmarks";
import UserProfile from "./UserInterface/Routes/UserProfile";
import Setting from "./UserInterface/Routes/Setting";
import Logout from "./UserInterface/Routes/Logout";
import AdminDashboard from "./AdminDashboard/AdminPages/Dashboard";
import AdminUsers from "./AdminDashboard/AdminPages/Users";
import AdminLogs from "./AdminDashboard/AdminPages/Logs";
import ContentCreatorDashboard from "./ContentCreater/Components/ContentCreatorDashboard"; 
import ContentCreatorProfile from "./ContentCreater/Components/Profile"; 
import ContentCreatorSidebar from "./ContentCreater/Components/sidebar"; 
import ContentCreatorMyherbs from "./ContentCreater/Components/MyHerbs"; 
import ContentCreatorAddherbs from "./ContentCreater/Components/AddHerb"; 
import ProtectedRoute from "./ProtectedRoute";
import AuthProvider from "./AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import LandingPage from "./UserInterface/Routes/LandingPage.jsx";
import Chatbot from "./UserInterface/Routes/LoginPages/Chatbot";

// NotFound Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
    </div>
  </div>
);

// Layout Component for User Pages
const UserLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
  </div>
);

// Layout Component for Admin Pages
const AdminLayout = () => {
  console.log("AdminLayout rendered");
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

// Layout Component for Content Creator Pages
const ContentCreatorLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <ContentCreatorSidebar />
    <div className="flex-1 ml-64">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    console.log("App initialization - checking auth...");
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("Found user in localStorage:", parsedUser);
        console.log("👤 User Role:", parsedUser.role);
        setIsAuthenticated(true);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      console.log("No authentication found");
    }
    setLoading(false);
  }, []);

  // Function to update authentication state (called from Login component)
  const handleSetAuthenticated = (value) => {
    console.log("Setting authenticated:", value);
    setIsAuthenticated(value);
  };

  const handleSetUserRole = (role) => {
    console.log("Setting user role:", role);
    setUserRole(role);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1]">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  console.log("🔍 Current State:", { isAuthenticated, userRole });

  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to landing page */}
            <Route path="/" element={<Navigate to="/landing" replace />} />

            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <Login 
                  setIsAuthenticated={handleSetAuthenticated} 
                  setUserRole={handleSetUserRole} 
                />
              } 
            />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/landing" element={<LandingPage />} />
            
            {/* Logout Route (Accessible from anywhere) */}
            <Route path="/logout" element={<Logout />} />

            {/* User Routes - For General Users */}
            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <UserLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="virtualTour" element={<VirtualTour />} />
              <Route path="story" element={<Story />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="setting" element={<Setting />} />
            </Route>

            {/* Admin Routes - For Admin Users */}
            <Route
              path="/admin"
              element={
                isAuthenticated && userRole === "admin" ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="manage-content" element={
                <>
                  {console.log("ManageContent route accessed")}
                  <ManageContent />
                </>
              } />
              <Route path="logs" element={<AdminLogs />} />
            </Route>

            {/* Content Creator Routes - For Content Creators */}
            <Route
              path="/content-creator"
              element={
                isAuthenticated && userRole === "content-creator" ? (
                  <ContentCreatorLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="/content-creator/dashboard" replace />} />
              <Route path="dashboard" element={<ContentCreatorDashboard />} />
              <Route path="profile" element={<ContentCreatorProfile />} />
              <Route path="my-herbs" element={<ContentCreatorMyherbs />} />
              <Route path="add-herb" element={<ContentCreatorAddherbs />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;