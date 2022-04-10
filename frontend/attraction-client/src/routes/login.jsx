import { Alert, AlertTitle, Box, Button, CircularProgress, Fade, TextField } from '@mui/material';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCookie } from "../functions/cookieManager";
import './styles/app.css';
import "./styles/login.css";
import { autoLogin } from "../functions/checkLoggedIn";

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

  const[languageTags, setLanguageTags] = useState({
                                                    usernameTextfield: "Username",
                                                    passwordTextfield: "Password",
                                                    loginButton: "LOGIN",
                                                    newUserButton: "NEW USER?",
                                                    resetPasswordButton: "RESET PASSWORD",
                                                    errorFieldTitle: "Error"
  });

  useEffect(() => {

    if(props.l1 == "de") {
      autoLogin();
      setLanguageTags({
                        usernameTextfield: "Benutzername",
                        passwordTextfield: "Passwort",
                        loginButton: "Anmelden",
                        newUserButton: "Neuer Benutzer?",
                        resetPasswordButton: "Passwort zurücksetzen",
                        errorFieldTitle: "Fehler"
      });

    } else if(props.l1 == "it") {

      setLanguageTags({
        usernameTextfield: "Nome utente",
        passwordTextfield: "Password",
        loginButton: "Accedi",
        newUserButton: "NUOVO UTENTE?",
        resetPasswordButton: "Ripristina la password",
        errorFieldTitle: "Errore"
      });

    } else {

      setLanguageTags({
        usernameTextfield: "Username",
        passwordTextfield: "Password",
        loginButton: "LOGIN",
        newUserButton: "NEW USER?",
        resetPasswordButton: "RESET PASSWORD",
        errorFieldTitle: "Error"
      });

   }

   setFullyLoaded(true)

  },[props.l1]);


  const [errorText, setErrorText] = useState("Error");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loadLogin, setLoadLogin] = useState(false);

  return (
    
    <div id='hintergrund'>     
      <div id='titel'><h1>City2Go</h1></div>
      {fullyLoaded ?
          <div id = "textfeld">
            <div id="widthTextfields">
              <div id="textFieldsLogin">
                <TextField sx={{ marginBottom: 1 }} autoFocus  inputProps={{ maxLength: 99 }} fullWidth id="filled-basic" label={languageTags.usernameTextfield} variant="filled" onChange={getUsernameValue} />
                <TextField sx={{ marginBottom: 0.5 }}  fullWidth id="filled-password-input" label={languageTags.passwordTextfield} type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    post(setErrorText, setShowErrorAlert, setLoadLogin);
                    e.preventDefault();
                }}}/>
              </div>
              <Button fullWidth id='btnLoginPage' disabled={loadLogin}  variant="conained" onClick={ () => post(setErrorText, setShowErrorAlert, setLoadLogin)}> {loadLogin ? <CircularProgress color="inherit" /> : languageTags.loginButton} </Button>    
            
              <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/register")}>{languageTags.newUserButton}</Button>
              
              <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/requestreset", {state: {l1: props.l1}})}>{languageTags.resetPasswordButton}</Button>
              
              {showErrorAlert ?
                <Fade in={showErrorAlert} timeout={250}>
                  <Alert id="loginErrorAlert" severity="error"> 
                      <AlertTitle>{languageTags.errorFieldTitle}</AlertTitle>
                          {errorText}
                  </Alert>
                </Fade>
              : null}

            </div>
          </div>
        :  
          <Box sx={{ display: 'flex', justifyContent:"center"}}>
            <CircularProgress color="inherit" size={80}/>
          </Box>
        }
    
      </div>   
     
  );
}

function post (setErrorText, setShowErrorAlert, setLoadLogin){
  setLoadLogin(true);
  let formData = new FormData();
  formData.append('username', usernameInput);
  formData.append('password', passwordInput)

  fetch("https://10.10.30.18:8443/login", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
    setLoadLogin(false);
      if (res.status == 400) { // error at login
          res.text().then(e => setErrorText(e));
          setShowErrorAlert(true);
      } else { // login worked
         window.location.href="/home";
      }
  });
}

export default Login;