import './styles/start.css';
import "./styles/register.css";
import './styles/app.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Alert, AlertTitle, Fade, Box, CircularProgress} from '@mui/material';
import {useState , setState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {setCookie, getCookie, checkCookie} from "../functions/cookieManager";

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

    //Language Settings
  const[usernameTextfieldTag, setUsernameTextfieldTag] = useState("Username");
  const[passwordTextfieldTag, setPasswordTextfieldTag] = useState("Password");
  const[retypePasswordTextfieldTag, setRetypePasswordTextfieldTag] = useState("Repeat Password");
  const[registerButtonTag, setRegisterButtonTag] = useState("REGISTER");
  const[alreadyLoggedInButtonTag, setAlreadyLoggedInButtonTag] = useState("ALREADY LOGGED IN?");
  const[errorFieldTitleTag, setErrorFieldTitleTag] = useState("Error");
  const[infoTag1, setInfoTag1] = useState("A confirmation email was sent — ");
  const[infoTag2, setInfoTag2] = useState("Check your mailbox!")
  
    useEffect(() => {

    if(props.l1 == "de") {
      setUsernameTextfieldTag("Benutzername");
      setPasswordTextfieldTag("Passwort");
      setRetypePasswordTextfieldTag("Passwort wiederholen");
      setRegisterButtonTag("REGISTRIEREN")
      setAlreadyLoggedInButtonTag("SCHON ANGEMELDET?")
      setErrorFieldTitleTag("Fehler");
      setInfoTag1("Eine Bestätigungsemail wurde versandt — ");
      setInfoTag2("Kontrolliere dein Email Postfach!")
    } else if(props.l1 == "it") {
      setUsernameTextfieldTag("Nome utente");
      setPasswordTextfieldTag("Password");
      setRetypePasswordTextfieldTag("Ridigitare la password")
      setRegisterButtonTag("Registra")
      setAlreadyLoggedInButtonTag("GIÀ REGISTRATO?")
      setErrorFieldTitleTag("Errore");
      setInfoTag1("Una mail di conferma è stata inviata — ");
      setInfoTag2("Controlla la tua casella email!")
    } else {
      setUsernameTextfieldTag("Username");
      setPasswordTextfieldTag("Password");
      setRetypePasswordTextfieldTag("Retype password")
      setRegisterButtonTag("REGISTER")
      setAlreadyLoggedInButtonTag("ALREADY LOGGED IN?")
      setErrorFieldTitleTag("Error");
      setInfoTag1("A confirmation email was sent — ");
      setInfoTag2("Check your mailbox!")
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

              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label={usernameTextfieldTag} variant="filled" onChange={getUsernameValue} />
             
              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label="Email" variant="filled" onChange={getEmailValue} />
              
              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-password-input" label={passwordTextfieldTag} type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
             
              <TextField sx={{ marginBottom: 0.5 }} fullWidth id="filled-password-input" label={retypePasswordTextfieldTag} type="password" autoComplete="current-password" variant="filled" onChange={getRetypePasswordValue} />

            </div>
              
              <Button fullWidth id="btnLoginPage" variant="conained" onClick={() => post(setErrorText, setShowErrorAlert, setShowInfoAlert)}>{registerButtonTag}</Button>
             
              <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/")}>{alreadyLoggedInButtonTag}</Button>
              
              <div>

                  {showErrorAlert ?
                    <Fade in={showErrorAlert} timeout={250}>
                      <Alert id="loginErrorAlert" severity="error">
                          <AlertTitle>{errorFieldTitleTag}</AlertTitle>
                          {errorText}
                      </Alert>
                      </Fade>
                      : null}


                  {showInfoAlert ? 
                    <Fade in={showInfoAlert} timeout={250}>
                    <Alert id="loginErrorAlert" false severity="info">
                      <AlertTitle>Info</AlertTitle>
                        {infoTag1} <strong>{infoTag2}</strong>
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