import React,{useState, useEffect, lazy, Suspense, Loader, Provider} from 'react';
import ReactDOM from "react-dom/client";
import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRouter";
import { useAuth } from "../../provider/AuthProvider";

const GuestGuard = (childrent) => {
    const { token } = useAuth();
  
    // Check if the user is authenticated
    if (token) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/" />;
    }
  
    // If authenticated, render the child routes
    return <>childrent</>
};

export default GuestGuard;