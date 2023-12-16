import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client'
import App from './App'
import store from "./store";
import { Provider } from "react-redux";

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
    </React.StrictMode>,
  ) 
}
