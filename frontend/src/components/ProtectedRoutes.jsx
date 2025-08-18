import React, { useContext, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const hasShownToast = useRef(false); // Track if toast has been shown

  useEffect(() => {
    if (!user && !hasShownToast.current) {
      toast.error("Please login to explore this feature");
      hasShownToast.current = true; // Prevent duplicate toasts
    }
  }, [user]);

  if (!user) {
    // Redirect to login and save current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
