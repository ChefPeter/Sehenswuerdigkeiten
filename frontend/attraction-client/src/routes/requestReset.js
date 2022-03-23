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
        <div>
            <Container maxWidth="sm">

                <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} > <div id="inputs"><Typography>
                    Input your email and click the button to reset your password.
                </Typography></div>
                    <TextField sx={{ width: 1 }} id="filled-basic" label="Email" variant="filled" onChange={setInput} />
                    <Button variant="contained" onClick={() => resetPassword(setErrorText, setShowErrorAlert, setShowInfoAlert)}>Reset</Button>

                    {showErrorAlert ?
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorText}
                        </Alert>
                        : null}
                    {showInfoAlert ? <Alert false severity="info">
                        <AlertTitle>Info</AlertTitle>
                            Ihnen wurde eine Email mit den Anweisungen zugeschickt!
                    </Alert> : null}

                </Box>

            </Container>
        </div>
    );
  
}

function resetPassword(setErrorText, setShowErrorAlert, setShowInfoAlert) {

    let formData = new FormData();
    formData.append('email', input);

    fetch("http://10.171.155.127:5000/request-reset", {
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