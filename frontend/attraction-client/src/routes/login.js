import './App.css';
import "./login.css";
import { Link } from "react-router-dom";
import { Button, TextField, Alert, AlertTitle} from '@mui/material';
import {useState , setState} from "react";

let usernameInput = "";
let passwordInput = "";

function Login(props) {

  const getUsernameValue = (event)=>{
    usernameInput = event.target.value;;
  };
  const getPasswordValue = (event) => {
    passwordInput = event.target.value;
};

  const [errorText, setErrorText] = useState("Error");
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  return (
    <div id='hintergrund'>     
      <div id='titel'>
        <h1>City2Go</h1>
      </div>
      <div id = "textfeld">
        <TextField id="filled-basic" label="Benutzername" variant="filled" onChange={getUsernameValue} />
        <br></br>
        <TextField id="filled-password-input" label="Passwort" type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
        <br></br>
        <Button id='knopf' variant="text" onClick={ () => post(setErrorText, setShowErrorAlert)}>Anmelden!</Button>    
        <br></br>
        <Button id='knopf' variant="text"><Link to="/register" style={{ textDecoration: 'none' }}>Neuer Benutzer</Link></Button>
        <br></br>
        <Button id='knopf' variant="text"><Link to="/requestreset" style={{ textDecoration: 'none' }}>Passwort zurücksetzen</Link></Button>

        <br></br>

        <Button onClick={() => handle()}>check</Button>
      </div>

        {showErrorAlert ?
            <Alert severity="error"> 
                <AlertTitle>Error</AlertTitle>
                    {errorText}
            </Alert>
        : null}

      
      </div>   
  );
}

function post (setErrorText, setShowErrorAlert){

  let formData = new FormData();
  formData.append('username', usernameInput);
  formData.append('password', passwordInput)

  fetch("http://10.171.155.127:5000/login", {
      method: "post",
      body: formData
  }).then(res => {
      if (res.status == 400) {
          res.text().then(e => setErrorText(e));
          setShowErrorAlert(true);
      } else {
          // Infofeld sichtbar machen
         console.log("JAWOLL")
         //window.location.href="/home"
      }
  });
}

function handle(){
  fetch("http://10.171.155.127:5000/logged-in", {
    method: "GET",
  }).then(res => {
    //not logged in
    console.log(res)
    if (res.status == 400) {
        //window.location.href="/login";
    } 
  });
}
export default Login;
