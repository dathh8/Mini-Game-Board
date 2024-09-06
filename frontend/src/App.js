import * as React from "react";
import  Routers  from './modules/Router';
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
    <React.StrictMode>
      <Provider store={store}>
        <div class='main-app'>
          <React.Suspense fallback={<div id="loader">.</div>}>
            <AuthProvider>
              <Routers />
            </AuthProvider>
          </React.Suspense>
        </div>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
