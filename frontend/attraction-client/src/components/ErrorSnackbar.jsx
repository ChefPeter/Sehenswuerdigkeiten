import React from "react";
import { Snackbar, Alert, Fade } from "@mui/material";


function ErrorSnackbar (props){

    return (
        <Fade in={props.openErrorSnack} timeout={120}>
        <Snackbar open={props.openErrorSnack} autoHideDuration={5000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity="error" sx={{ width: '100%' }}>
                {props.errorMessage}
            </Alert>
        </Snackbar>
        </Fade>
    );

}

export default ErrorSnackbar;