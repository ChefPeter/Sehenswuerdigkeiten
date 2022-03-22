import './App.css';
import "./register.css";
import { Link } from "react-router-dom";
import { Button, TextField, Alert, AlertTitle} from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';

let usernameInput = "";
let emailInput = "";
let passwordInput = "";
let retypePasswordInput = "";

function Login() {

    const getUsernameValue = (event)=>{
        usernameInput = event.target.value;;
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

  return (
    <div id='hintergrund'>
        <div id='eingaben'>

            <TextField id="filled-basic" label="Benutzername" variant="filled" onChange={getUsernameValue} />
            <br></br>
            <TextField id="filled-basic" label="Email" variant="filled" onChange={getEmailValue} />
            <br></br>
            <TextField id="filled-password-input" label="Passwort" type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
            <br></br>
            <TextField id="filled-password-input" label="Passwort wiederholen" type="password" autoComplete="current-password" variant="filled" onChange={getRetypePasswordValue} />
            <br></br>
            <Button id = "knopf" variant="text" onClick={() => post()}>Registrieren</Button>
            <br></br>
            <Button id='knopf' variant="text"><Link to="/" style={{ textDecoration: 'none' }}>Schon angemeldet?</Link></Button>
            <br></br>
            <div>
                <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                    Eine Bestätigungsemail wurde versandt — <strong>Checke dein Postfach</strong>
                </Alert>
            </div>
        </div>    
    </div>
  );
}

function post (){

    console.log(usernameInput)
    /*fetch("http://10.171.155.62:3000/register", {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        "username": "",
        "email": "",
        "password": "",
        "repeat-password": "",
        })
    })*/
}

export default Login;