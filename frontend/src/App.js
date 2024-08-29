import logo from './logo.svg';
import * as React from "react";
import  Routers  from './modules/Router';
import {createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import rootReducer from './reducers/DataReducer';
import AuthProvider from "./provider/AuthProvider";

function App() {

   // initialState
   const initialState = {}

   // Create store
   const store = createStore(rootReducer, initialState);

  return (
    <Provider store={store}>
      <div class='main-app'>
        <React.Suspense fallback={<div id="loader">.</div>}>
          <AuthProvider>
            <Routers />
          </AuthProvider>
        </React.Suspense>
      </div>
    </Provider>
  );
}

export default App;
