import React,{useState, useEffect, lazy, Suspense, Loader, Provider} from 'react';
import ReactDOM from "react-dom/client";
import {Navigate, createBrowserRouter, RouterProvider, Route, Link, useRoutes } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "../modules/ProtectedRouter";
import Guard from "./gruards/GuestGuard";
const Login = React.lazy(() => import('../components/Login/Login'));
const Header = React.lazy(() => import('../components/Header/header'));
const Footer = React.lazy(() => import('../components/Footer/footer'));
const HomePage = React.lazy(() => import('../components/Page/HomePage/home'));
const BattleShip = React.lazy(() => import('../components/Page/BattleShip/battleShip'));
const Xo = React.lazy(() => import('../components/Page/Xo/xo'));

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/battle-ship/*",
      element: <BattleShip/>,
    },
    {
      path: "/",
      element: <HomePage/>,
    },
    {
      path: "/xo",
      element: <Xo/>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
    //   path: "/", element: token ?  <Index />  : <Navigate to="/login"/>,
    //   children: [
    //     {
    //       path: "user",
    //       element: token ?  <UserList />  : <Navigate to="/login"/>, 
    //     },
    //     {
    //       path: "user/form",
    //       element: token ?  <UserForm />  : <Navigate to="/login"/>,
        // },
        // {
        //   path: "login",
        //   element: <Login />
        // },
    //   ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/a",
      element: <div>Home Page</div>,
    },
    {
      path: "/login",
      element: token ?  <Navigate to="/"/>  : <Login />
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : routesForNotAuthenticatedOnly),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;