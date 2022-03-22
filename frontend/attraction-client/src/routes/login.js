import './App.css';
import "./login.css";
import { Link } from "react-router-dom";
import { Button, TextField } from '@mui/material';
import Header from '../components/header';
import DeleteIcon from '@mui/icons-material/Delete';

function Login(props) {
  return (
    <div id='hintergrund'>
      <div id='titel'>
        <h1>City2Go</h1>
      </div>
      <div id = "textfeld">
        <TextField id="filled-basic" label="Benutzername" variant="filled" />
        <br></br>
        <TextField id="filled-basic" label="Passwort" variant="filled" />
        <br></br>
        <Button variant="text"><Link to="/home" style={{ textDecoration: 'none' }}>Anmelden</Link></Button>    
        <Button variant="text"><Link to="/register" style={{ textDecoration: 'none' }}>Neuer Benutzer</Link></Button>
      </div>
    </div>    
  );
}

export default Login;
