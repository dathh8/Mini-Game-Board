import React,{useState, useEffect, lazy, Suspense, Loader, Provider} from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const MultiPlayer = React.lazy(() => import('./components/multiplePlayer'));
const SinglePlayer = React.lazy(() => import('./components/singlePlayer'));
const Home = React.lazy(() => import('./components/home'));

const BattleShipRouter = () => {

  // Provide the router configuration using RouterProvider
  return (
    <Routes> 
        <Route path="/" element={<Home/>} />
        <Route path="/multiplayer" element={<MultiPlayer/>} />
        <Route path="/single-player" element={<SinglePlayer/>} />
    </Routes>
  );
};

export default BattleShipRouter;