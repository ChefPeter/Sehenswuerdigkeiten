    import './styles/app.css';
    import "./styles/login.css";
    import { Button, TextField, Alert, AlertTitle, Fade} from '@mui/material';
    import {useState , setState} from "react";
    import { useNavigate } from "react-router-dom";

    let usernameInput = "";
    let passwordInput = "";

    function Login(props) {

        const navigate = useNavigate();
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
                <div id="widthTextfields">
                <div id="textFieldsLogin">
                    <TextField sx={{ marginBottom: 1 }} fullWidth id="filled-basic" label="Benutzername" variant="filled" onChange={getUsernameValue} />
                    <TextField sx={{ marginBottom: 0.5 }} fullWidth id="filled-password-input" label="Passwort" type="password" autoComplete="current-password" variant="filled" onChange={getPasswordValue} />
                </div>
                <Button fullWidth id='btnLoginPage' variant="conained" onClick={ () => post(setErrorText, setShowErrorAlert)}>Anmelden!</Button>    
                <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/register")}>Neuer Benutzer</Button>
                <Button fullWidth id='btnLoginPage' variant="conained" onClick={() => navigate("/requestreset")}>Passwort zurücksetzen</Button>
                {showErrorAlert ?
                    <Fade in={showErrorAlert} timeout={250}>
                    <Alert id="loginErrorAlert" severity="error"> 
                        <AlertTitle>Error</AlertTitle>
                            {errorText}
                    </Alert>
                    </Fade>
                : null}

                </div>
            </div>
            
            </div>   
        );
        
    }

    function post (setErrorText, setShowErrorAlert){

    let formData = new FormData();
    formData.append('username', usernameInput);
    formData.append('password', passwordInput)

    fetch("http://localhost:5000/login", {
        method: "post",
        body: formData,
        credentials: 'include'
    }).then(res => {
        if (res.status == 400) {
            res.text().then(e => setErrorText(e));
            setShowErrorAlert(true);
        } else {
            // Infofeld sichtbar machen
            console.log("JAWOLL")
            window.location.href="/home";
            
        }
    });
    }


    function handle(){
    fetch("http://localhost:5000/logged-in", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.text())
    .then(res => {
        //not logged in
        console.log(res)
        //if (res.status == 400) {
            //window.location.href="/login";
        //} 
    });
    }



    export default Login;
