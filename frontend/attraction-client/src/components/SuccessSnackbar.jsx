import React from "react";
import { Snackbar, Alert, Fade } from "@mui/material";

function SuccessSnackbar (props){

    return (
        <Fade in={props.openSuccessSnack} timeout={120}>
            <Snackbar open={props.openSuccessSnack} autoHideDuration={5000} onClose={props.handleClose}>
                <Alert onClose={props.handleClose} severity="success" sx={{ width: '100%' }}>
                    {props.successMessage}
                </Alert>
            </Snackbar>
        </Fade>
    );

}

export default SuccessSnackbar;