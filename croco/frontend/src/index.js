import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContext } from './Components/Context';

const checkBuyer = localStorage.getItem('buyer_login');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Router>
      <UserContext.Provider value={checkBuyer}>
        <App />
      </UserContext.Provider>
    </Router>
  </>
);


reportWebVitals();