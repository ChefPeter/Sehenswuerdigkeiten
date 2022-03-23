import './App.css';
import "./register.css";
import { Link } from "react-router-dom";
import { Button, TextField, Alert, AlertTitle} from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState , setState} from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from 'react/cjs/react.production.min';


let passwordInput = "";
let retypePasswordInput = "";
let email = "";
let token = "";

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
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect (() => {
        email = searchParams.get("email");
        token = searchParams.get("token");
    });
   
//email
//token
//password
//retype password





  return (
      <div>

            <TextField id="filled-password-input" label="Passwort" type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
              <br></br>
              <TextField id="filled-password-input" label="Passwort wiederholen" type="password" autoComplete="current-password" variant="filled" onChange={getRetypePasswordValue} />
              <br></br>
              <Button id="knopf" variant="text" onClick={() => post(setErrorText, setShowErrorAlert, setShowInfoAlert, email, token)}>Registrieren</Button>
              <br></br>
              <Button id='knopf' variant="text"><Link to="/" style={{ textDecoration: 'none' }}>Schon angemeldet?</Link></Button>
              <br></br>
              <div>

                  {showErrorAlert ?
                      <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {errorText}
                      </Alert>
                      : null}


                  {showInfoAlert ? <Alert false severity="info">
                      <AlertTitle>Info</AlertTitle>
                      Eine Bestätigungsemail wurde versandt — <strong>Checke dein Postfach</strong>
                  </Alert> : null}

              </div>

      </div>
  );
}

function post (setErrorText, setShowErrorAlert, setShowInfoAlert, email, token){
    console.log(email)

    let formData = new FormData();
    formData.append('password', passwordInput);
    formData.append('repeat-password', retypePasswordInput);


}

export default ResetPassword;