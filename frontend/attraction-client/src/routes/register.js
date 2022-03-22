import './App.css';
import "./register.css";
import { Link } from "react-router-dom";
import { Button, TextField, Alert, AlertTitle} from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';

function Login() {
  return (
    <div id='hintergrund'>
        <div id='eingaben'>

            <TextField id="filled-basic username" label="Benutzername" variant="filled" />
            <br></br>
            <TextField id="filled-basic" label="Email" variant="filled" />
            <br></br>
            <TextField id="filled-basic" label="Passwort" variant="filled" />
            <br></br>
            <TextField id="filled-basic" label="Passwort Wiederholen" variant="filled" />
            <br></br>
            <Button variant="text" onClick={() => post()}>Registrieren</Button>
           
            <div>
                <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                Eine Bestätigungsemail wurde versandt — <strong>Checke dein Postfach</strong>
                </Alert>
            </div>

            <Button variant="text"><Link to="/" style={{ textDecoration: 'none' }}>Schon angemeldet?</Link></Button>

        </div>    
    </div>
  );
}

function post (){

    console.log(document.getElementById("username-label").value);
    console.log("DIOCANE");
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