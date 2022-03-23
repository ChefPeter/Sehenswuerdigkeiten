import './App.css';
import "./login.css";
import { Link } from "react-router-dom";
import { Button, TextField, Alert, AlertTitle} from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';
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
  console.log(passwordInput)
  console.log(usernameInput)
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
         window.location.href="/home"
      }
  });

}


export default Login;
