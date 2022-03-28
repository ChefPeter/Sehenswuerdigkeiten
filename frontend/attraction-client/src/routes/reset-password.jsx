import { Button, TextField, Alert, AlertTitle, Container, Box, Typography} from '@mui/material';
import {useState} from "react";
import { useSearchParams } from "react-router-dom";


let passwordInput = "";
let retypePasswordInput = "";

function ResetPassword() {
    const getPasswordValue = (event) => {
        passwordInput = event.target.value;
    };
    const getRetypePasswordValue = (event) => {
        retypePasswordInput = event.target.value;
    };

    const [errorText, setErrorText] = useState("Error");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [searchParams] = useSearchParams();

  return (
      <div id='hintergrund'>
        <div id='inputs'>
            <div id='befehl'>
                <h1>Bitte neues Passwort eingeben!</h1>
            </div>
            <div style={{width: "30vw", minWidth: "300px"}}>
                <TextField sx={{ marginBottom: 1, width: 1}} id="filled-password-input" label="Passwort" type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
                <TextField sx={{ marginBottom: 1, width: 1}} id="filled-password-input" label="Passwort wiederholen" type="password" autoComplete="current-password" variant="filled" onChange={getRetypePasswordValue} />
                <Button fullWidth id='btnLoginPage' variant="text" onClick={ () => post(setErrorText, setShowErrorAlert, setShowInfoAlert, searchParams.get("email"), searchParams.get("token"))}>Registrieren</Button>    
            </div>
        <div>
            <div>
                {showErrorAlert ?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorText}
                </Alert>
                : null}
            </div>
            <div>
                {showInfoAlert ? <Alert false severity="info">
                <AlertTitle>Info</AlertTitle>
                    Dein Passwort wurde zurückgesetzt! <a href="/login">Login</a>
                </Alert> : null}
            </div>
        </div>
      </div>
    </div>
  );
}

function post (setErrorText, setShowErrorAlert, setShowInfoAlert, email, token){
    console.log(email)
    console.log(passwordInput)
    console.log(retypePasswordInput)


    let formData = new FormData();
    formData.append('new-password', passwordInput);
    formData.append('repeat-new-password', retypePasswordInput);
    formData.append('reset-token',token)
    formData.append('email', email);

    fetch("http://10.171.155.127:5000/reset-password", {
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

export default ResetPassword;