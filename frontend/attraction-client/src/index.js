import React, { useState, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import { checkCookie } from './functions/cookieManager';
import './index.css';
import Approve from './routes/approve';
import Chat from './routes/chat';
import Contact from "./routes/contact";
//import ErrorPage from './routes/errorPage';
//import Friends from "./routes/friends";
//import Groups from "./routes/groups";
//import GroupSettings from './routes/groupSettings';
import Home from "./routes/home";
//import LegalNotice from './routes/legalnotice';
import Login from "./routes/login";
//import Profile from './routes/profile';
import Register from "./routes/register";
import RequestReset from "./routes/requestReset";
import ResetPassword from './routes/reset-password';

const rootElement = document.getElementById("root");

const Profile = lazy(() => import ('./routes/profile'));
const LegalNotice = lazy(() => import ('./routes/legalnotice'));
const GroupSettings = lazy(() => import ('./routes/groupSettings'));
const Groups = lazy(() => import ('./routes/groups'));
const Friends = lazy(() => import ('./routes/friends'));
const ErrorPage = lazy(() => ('./routes/errorPage'));

const Routing = () => {
 
  const [globalTheme, setGlobalTheme] = useState(checkCookie("theme"));
  const [globalLanguage, setGlobalLanguage] = useState(checkCookie("language"));

  return(
  <BrowserRouter>
    
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/" element={<Login t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="" element={<Login t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="login" element={<Login t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="register" element={<Register t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="*" element={<ErrorPage />} />

          <Route path="home" element={<Home t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} /> } />
          <Route path="groups" element={<Groups t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="friends" element={<Friends t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="contact" element={<Contact t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path="approve" element={<Approve t1={globalTheme} l1={globalLanguage} />}/>
          <Route path="requestReset" element={<RequestReset t1={globalTheme} l1={globalLanguage} />}/>
          <Route path="reset-password" element={<ResetPassword l1={globalLanguage} />}/>
          <Route path="profile" element={<Profile t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />}></Route>
          <Route path='legalnotice' element={<LegalNotice t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path='chat' element={<Chat t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
          <Route path='groupSettings' element={<GroupSettings t1={globalTheme} t2={setGlobalTheme} l1={globalLanguage} l2={setGlobalLanguage} />} />
        </Routes>
      </Suspense>
    
  </BrowserRouter>
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
