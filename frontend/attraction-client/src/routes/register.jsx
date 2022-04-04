import { Alert, AlertTitle, Box, Button, CircularProgress, Fade, TextField } from '@mui/material';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCookie } from "../functions/cookieManager";
import './styles/app.css';
import "./styles/register.css";
import './styles/start.css';

let usernameInput = "";
let emailInput = "";
let passwordInput = "";
let retypePasswordInput = "";


function Register(props) {

    const navigate = useNavigate();

    const getUsernameValue = (event)=>{
        usernameInput = event.target.value;
    };
    const getEmailValue = (event) => {
        emailInput = event.target.value;
    }
    const getPasswordValue = (event) => {
        passwordInput = event.target.value;
    };
    const getRetypePasswordValue = (event) => {
        retypePasswordInput = event.target.value;
    };


    const [fullyLoaded, setFullyLoaded] = useState(false);
    const [errorText, setErrorText] = useState("Error");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {

        props.t2(checkCookie("theme"))
        props.l2(checkCookie("language"))
    
    });


  const [languageTags, setLanguageTags] = useState({
                                                      usernameTextfield: "Username",
                                                      passwordTextfield: "Password",
                                                      retypePasswordTextfield: "Repeat Password",
                                                      registerButton: "REGISTER",
                                                      alreadyLoggedInButton: "ALREADY LOGGED IN?",
                                                      errorFieldTitle: "Error",
                                                      info1: "A confirmation email was sent — ",
                                                      info2: "Check your mailbox!"
  });
  
    useEffect(() => {

    if(props.l1 === "de") {

      setLanguageTags({
                          usernameTextfield: "Benutzername",
                          passwordTextfield: "Passwort",
                          retypePasswordTextfield: "Passwort wiederholen",
                          registerButton: "REGISTRIEREN",
                          alreadyLoggedInButton: "SCHON ANGEMELDET?",
                          errorFieldTitle: "Fehler",
                          info1: "Eine Bestätigungsemail wurde versandt — ",
                          info2: "Kontrolliere dein Email Postfach!"
      });


    } else if(props.l1 === "it") {

      setLanguageTags({
                        usernameTextfield: "Nome utente",
                        passwordTextfield: "Password",
                        retypePasswordTextfield: "Ridigitare la password",
                        registerButton: "Registra",
                        alreadyLoggedInButton: "GIÀ REGISTRATO?",
                        errorFieldTitle: "Errore",
                        info1: "Una mail di conferma è stata inviata — ",
                        info2: "Controlla la tua casella email!"
      });

    } else {

      setLanguageTags({
                        usernameTextfield: "Username",
                        passwordTextfield: "Password",
                        retypePasswordTextfield: "Repeat Password",
                        registerButton: "REGISTER",
                        alreadyLoggedInButton: "ALREADY LOGGED IN?",
                        errorFieldTitle: "Error",
                        info1: "A confirmation email was sent — ",
                        info2: "Check your mailbox!"
      });

   }
   setFullyLoaded(true)
  },[props.l1]);


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
      { fullyLoaded ? 
      <div id = "textfeld">
        <div id="widthTextfields">
          <div id="textFieldsLogin">

              <TextField sx={{ marginBottom: 1 }} autoFocus fullWidth id="filled-basic" label={languageTags.usernameTextfield} variant="filled" onChange={getUsernameValue} />
             
              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label="Email" variant="filled" onChange={getEmailValue} />
              
              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-password-input" label={languageTags.passwordTextfield} type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
             
              <TextField sx={{ marginBottom: 0.5 }} fullWidth id="filled-password-input" label={languageTags.retypePasswordTextfield} type="password" autoComplete="current-password" variant="filled" onChange={getRetypePasswordValue} 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    post(setErrorText, setShowErrorAlert, setShowInfoAlert)
                    e.preventDefault();
                }}}/>

            </div>
              
              <Button fullWidth id="btnLoginPage" variant="conained" onClick={() => post(setErrorText, setShowErrorAlert, setShowInfoAlert)}>{languageTags.registerButton}</Button>
             
              <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/")}>{languageTags.alreadyLoggedInButton}</Button>
              
              <div>

                  {showErrorAlert ?
                    <Fade in={showErrorAlert} timeout={250}>
                      <Alert id="loginErrorAlert" severity="error">
                          <AlertTitle>{languageTags.errorFieldTitle}</AlertTitle>
                          {errorText}
                      </Alert>
                      </Fade>
                      : null}


                  {showInfoAlert ? 
                    <Fade in={showInfoAlert} timeout={250}>
                    <Alert id="loginErrorAlert" false severity="info">
                      <AlertTitle>Info</AlertTitle>
                        {languageTags.info1} <strong>{languageTags.info2}</strong>
                    </Alert> 
                    </Fade>
                    : null}
                </div>
            </div>
              </div>
          : null }

      </div>
  );
}

function post (setErrorText, setShowErrorAlert, setShowInfoAlert){

    let formData = new FormData();
    formData.append('username', usernameInput);
    formData.append('email', emailInput);
    formData.append('password', passwordInput);
    formData.append('repeat-password', retypePasswordInput);
    fetch("http://localhost:5000/register", {
        method: "post",
        body: formData
    }).then(res => {
        if (res.status == 400) {
            setShowInfoAlert(false);
            res.text().then(e => setErrorText(e));
            setShowErrorAlert(true);
        } else {
            // Infofeld sichtbar machen
            setShowErrorAlert(false);
            setShowInfoAlert(true);
        }
    });
}

export default Register;