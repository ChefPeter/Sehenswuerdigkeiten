import './styles/app.css';
import "./styles/login.css";
import { Button, TextField, Alert, AlertTitle, Fade, CircularProgress, Box} from '@mui/material';
import {useState , setState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {setCookie, getCookie, checkCookie} from "../functions/cookieManager";
import { textAlign } from '@mui/system';

let usernameInput = "";
let passwordInput = "";

function Login(props) {
  const navigate = useNavigate();
  const getUsernameValue = (event)=>{
    usernameInput = event.target.value;;
  };
  const getPasswordValue = (event) => {
    passwordInput = event.target.value;
};

  const [fullyLoaded, setFullyLoaded] = useState(false);

  useEffect(() => {

    props.t2(checkCookie("theme"))
    props.l2(checkCookie("language"))

  });


  //Language Settings
  const[usernameTextfieldTag, setUsernameTextfieldTag] = useState("Username");
  const[passwordTextfieldTag, setPasswordTextfieldTag] = useState("Password");
  const[loginButtonTag, setLoginButtonTag] = useState("LOGIN");
  const[newUserButtonTag, setNewUserButtonTag] = useState("NEW USER?");
  const[resetPasswordButtonTag, setResetPasswordButtonTag] = useState("RESET PASSWORD");
  const[errorFieldTitleTag, setErrorFieldTitleTag] = useState("Error");

  useEffect(() => {

    if(props.l1 == "de") {
      setUsernameTextfieldTag("Benutzername");
      setPasswordTextfieldTag("Passwort");
      setLoginButtonTag("Anmelden");
      setNewUserButtonTag("Neuer Benutzer?");
      setResetPasswordButtonTag("Passwort zurücksetzen");
      setErrorFieldTitleTag("Fehler");
    } else if(props.l1 == "it") {
      setUsernameTextfieldTag("Nome utente");
      setPasswordTextfieldTag("Password");
      setLoginButtonTag("Accedi");
      setNewUserButtonTag("NUOVO UTENTE?");
      setResetPasswordButtonTag("Ripristina la password");
      setErrorFieldTitleTag("Errore");
    } else {
      setUsernameTextfieldTag("Username");
      setPasswordTextfieldTag("Password");
      setLoginButtonTag("LOGIN");
      setNewUserButtonTag("NEW USER?");
      setResetPasswordButtonTag("RESET PASSWORD");
      setErrorFieldTitleTag("Error");
   }
   setFullyLoaded(true)
  },[props.l1]);


  const [errorText, setErrorText] = useState("Error");
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  return (
    
    <div id='hintergrund'>     
      <div id='titel'>
        <h1>City2Go</h1>
      </div>
      {!fullyLoaded ?
        <Box sx={{ display: 'flex', justifyContent:"center"}}>
          <CircularProgress color="inherit" size={80}/>
        </Box>
      : null}
      {fullyLoaded ?
      <div id = "textfeld">
        <div id="widthTextfields">
          <div id="textFieldsLogin">
            <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label={usernameTextfieldTag} variant="filled" onChange={getUsernameValue} />
            <TextField sx={{ marginBottom: 0.5 }} fullWidth id="filled-password-input" label={passwordTextfieldTag} type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
          </div>
          <Button fullWidth id='btnLoginPage' variant="conained" onClick={ () => post(setErrorText, setShowErrorAlert)}>{loginButtonTag}</Button>    
         
          <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/register")}>{newUserButtonTag}</Button>
          
          <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/requestreset")}>{resetPasswordButtonTag}</Button>
          
          {showErrorAlert ?
            <Fade in={showErrorAlert} timeout={250}>
              <Alert id="loginErrorAlert" severity="error"> 
                  <AlertTitle>{errorFieldTitleTag}</AlertTitle>
                      {errorText}
              </Alert>
            </Fade>
          : null}

        </div>
      </div>
       : null}
    
      </div>   
     
  );
}

function post (setErrorText, setShowErrorAlert){

  let formData = new FormData();
  formData.append('username', usernameInput);
  formData.append('password', passwordInput)

  fetch("http://localhost:5000/login", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
      if (res.status == 400) {
          res.text().then(e => setErrorText(e));
          setShowErrorAlert(true);
      } else {
          // Infofeld sichtbar machen
         console.log("JAWOLL")
         window.location.href="/home";
         
      }
  });
}


function handle(){
  fetch("http://localhost:5000/logged-in", {
    method: "GET",
    credentials: "include"
  })
  .then(res => res.text())
  .then(res => {
    //not logged in
    console.log(res)
    //if (res.status == 400) {
        //window.location.href="/login";
    //} 
  });
}


export default Login;