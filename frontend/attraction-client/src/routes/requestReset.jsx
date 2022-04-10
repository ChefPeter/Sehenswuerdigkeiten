import { Alert, AlertTitle, Button, TextField } from '@mui/material';
import { useState } from "react";
import "./styles/requestReset.css";

let input = "";

function RequestReset(props) {

    const setInput = (event)=>{
        input = event.target.value;
    };
    
    const [errorText, setErrorText] = useState("Error");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    
    let resetText = "Enter your email and click reset button!";
    let successMessage = "You have been sent an email with the instructions!";
    if(props.l1 == "de"){
        resetText = "Email eingeben und Reset Button clicken!";
        successMessage = "Ihnen wurde eine Email mit den Anweisungen zugeschickt!";
    } else if(props.l1 == "it"){
        resetText = "Inserisci l'email e clicca sul pulsante di reset!";
        successMessage = "Ti è stata inviata un'e-mail con le istruzioni!";
    }
       
    return (
        <div id="hintergrund">
            <div id="inputs">
            <div id="befehl">
                    <h1>{resetText}</h1>
                </div>
                <div style={{width: "30vw", minWidth: "300px"}}>
                    <TextField sx={{ marginBottom: 1, width: 1}} id="filled-basic" label="Email" variant="filled" onChange={setInput} />
                    <div>
                        <Button fullWidth id='btnLoginPage' variant="conained" onClick={ () => resetPassword(setErrorText, setShowErrorAlert, setShowInfoAlert)}>Reset</Button>    
                    </div>
                </div>
                <div>
                    <div>
                        {showErrorAlert ?
                            <Alert sx={{mt: 3}} severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorText}
                            </Alert>
                            : null}
                    </div>
                        <div>
                            {showInfoAlert ? <Alert sx={{mt: 3}} false severity="info">
                            <AlertTitle>Info</AlertTitle>
                                {successMessage}
                            </Alert> : null}
                        </div>
                </div>
            </div>
        </div>
    );
  
}

function resetPassword(setErrorText, setShowErrorAlert, setShowInfoAlert) {

    let formData = new FormData();
    formData.append('email', input);

    fetch("https://10.10.30.18:8444/request-reset", {
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


export default RequestReset;