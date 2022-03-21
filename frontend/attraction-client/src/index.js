import React from 'react';
import ReactDOM from 'react-dom';
import { render } from "react-dom";
import './index.css';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Start from "./routes/start";
import Login from "./routes/login";
import Register from "./routes/register"

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
    
      <Route path="/" element={<Login/>} />
      <Route path="app" element={<App />} />
      <Route path="start" element={<Start />} />
      <Route path="register" element={<Register />} />

    </Routes>

  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
