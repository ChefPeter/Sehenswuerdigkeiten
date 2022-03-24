import './styles/start.css';
import "./styles/register.css";
import { Button, TextField, Alert, AlertTitle} from '@mui/material';
import './App.css';
import "./register.css";
import { Link } from "react-router-dom";
import { Button, TextField, Alert, AlertTitle, Fade} from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState , setState} from "react";
import { useNavigate } from "react-router-dom";


let usernameInput = "";
let emailInput = "";
let passwordInput = "";
let retypePasswordInput = "";

function Register() {

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

    const [errorText, setErrorText] = useState("Error");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

  return (
      <div id='hintergrund'>
          <div id='titel'>
        <h1>City2Go</h1>
      </div>
      <div id = "textfeld">
        <div id="widthTextfields">
          <div id="textFieldsLogin">

              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label="Benutzername" variant="filled" onChange={getUsernameValue} />
             
              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label="Email" variant="filled" onChange={getEmailValue} />
              
              <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-password-input" label="Passwort" type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
             
              <TextField sx={{ marginBottom: 0.5 }} fullWidth id="filled-password-input" label="Passwort wiederholen" type="password" autoComplete="current-password" variant="filled" onChange={getRetypePasswordValue} />

            </div>
              
              <Button fullWidth id="btnLoginPage" variant="conained" onClick={() => post(setErrorText, setShowErrorAlert, setShowInfoAlert)}>Registrieren</Button>
             
              <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/")}>Schon angemeldet?</Button>
              
              <div>

                  {showErrorAlert ?
                    <Fade in={showErrorAlert} timeout={250}>
                      <Alert id="loginErrorAlert" severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {errorText}
                      </Alert>
                      </Fade>
                      : null}


                  {showInfoAlert ? 
                    <Fade in={showInfoAlert} timeout={250}>
                    <Alert id="loginErrorAlert" false severity="info">
                      <AlertTitle>Info</AlertTitle>
                      Eine Bestätigungsemail wurde versandt — <strong>Checke dein Postfach</strong>
                    </Alert> 
                    </Fade>
                    : null}
                </div>
            </div>
              </div>
          

      </div>
  );
}

function post (setErrorText, setShowErrorAlert, setShowInfoAlert){

    
    let formData = new FormData();
    formData.append('username', usernameInput);
    formData.append('email', emailInput);
    formData.append('password', passwordInput);
    formData.append('repeat-password', retypePasswordInput);
    console.log("hdahhq")
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