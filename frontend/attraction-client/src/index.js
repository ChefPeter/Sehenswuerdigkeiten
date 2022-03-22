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
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Explore from "./routes/explore";
import Groups from "./routes/groups";
import Friends from "./routes/friends";
import Notifications from "./routes/notifications";
import Contact from "./routes/contact";
import { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { createStore } from "redux"; 
import rootReducer from './reducers/rootReducer';
import { createTheme } from '@mui/material';
import store from './reducers/store';
import { connect } from "react-redux";
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const rootElement = document.getElementById("root");

const Routing = () => {
 
  return(
  <Provider store={store}>  
  <BrowserRouter>
    <Routes>
    
      <Route path="/" element={<Login/>} />
      <Route path="" element={<Login/>} />
      <Route path="login" element={<Login/>} />
      <Route path="app" element={<App /> }/>
      <Route path="home" element={<Home /> } />
      <Route path="register" element={<Register />} />
      <Route path="explore" element={<Explore />} />
      <Route path="groups" element={<Groups />} />
      <Route path="friends" element={<Friends />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="contact" element={<Contact />} />

    </Routes>

  </BrowserRouter>
  </Provider> 
 );

}

ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
