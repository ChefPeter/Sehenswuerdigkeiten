import './App.css';
import "./login.css";
import { Link } from "react-router-dom";
import { Button, TextField } from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';

function Login() {
  return (
    <div id='hintergrund'>
        <div id = "textfeld">
            <TextField id="filled-basic" label="Benutzername" variant="filled" />
            <TextField id="filled-basic" label="Passwort" variant="filled" />
            <br></br>
            <Button variant="text"><Link to="/register" style={{ textDecoration: 'none' }}>Neuer Benutzer</Link></Button>
            <Button variant="text"><Link to="/start" style={{ textDecoration: 'none' }}>Anmelden</Link></Button>
        </div>
    </div>    
  );
}

export default Login;
