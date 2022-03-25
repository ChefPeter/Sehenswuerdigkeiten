import { Link } from "react-router-dom";
import Header from "../components/header";
import "./styles/requestReset.css";
import { Button, Container, Typography, Box, TextField, Alert, AlertTitle, Paper, getTableSortLabelUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import { useState } from "react";

let input = "";

function RequestReset(props) {

    const setInput = (event)=>{
        input = event.target.value;
    };
    
    const [errorText, setErrorText] = useState("Error");
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    return (
        <div id="hintergrund">
            <div id="inputs">
                <div id="befehl">
                    <h1>Email eingeben und Reset Button clicken!</h1>
                </div>
                <div id = "abstand">
                    <TextField sx={{ width: 1 }} id="filled-basic" label="Email" variant="filled" onChange={setInput} />
                    <div id="abstand">
                        <Button variant="text" onClick={() => resetPassword(setErrorText, setShowErrorAlert, setShowInfoAlert)} style={{ textDecoration: 'none' }} id="knopf">Reset</Button>
                    </div>
                       </div>
                <div id="abstand">
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
                                Ihnen wurde eine Email mit den Anweisungen zugeschickt!
                            </Alert> : null}
                        </div>
                </div>
            </div>
        </div>
    );
  
}

function resetPassword(setErrorText, setShowErrorAlert, setShowInfoAlert) {
    console.log(input)
    let formData = new FormData();
    formData.append('email', input);

    fetch("http://localhost:5000/request-reset", {
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
        console.log(res.status)
    });
    console.log("haha")
}


export default RequestReset;