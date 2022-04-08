import { Button, Card } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import React, { useEffect, useState } from "react";
import ErrorSnackbar from '../components/ErrorSnackbar';
import Sidebar from "../components/Sidebar";
import SuccessSnackbar from '../components/SuccessSnackbar';
import { checkCurrentlyLoggedIn } from "../functions/checkLoggedIn";
import "../routes/styles/contact.css";

// Define theme settings
const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
  
};
let contactInput = "";

function Contact(props) {

  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [colorTextfield, setColorTextfield] = useState("#f5f5f5");
  const[colorFontTextfield, setColorFontTextfield] = useState("#424242");

  
  const[languageTags, setLanguageTags] = useState({
    headText: "Please simply write your request in the text field. We will get back to you as soon as possible!",
    textField: "Type your message!",
    buttonText: "SEND MESSAGE",
    errorMessage: "Your message could not be sent!",
    successMessage: "Your message has been sent!"
  });

  const[loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    setLoggedIn(checkCurrentlyLoggedIn());
  }, []);

  //THEME USE EFFECT [props.t1]
  useEffect(() => {
    if(props.t1 === "dark"){
      setColorTextfield("#424242");
      setColorFontTextfield("#f5f5f5");
    } else{
      setColorTextfield("#f5f5f5");
      setColorFontTextfield("#000000");
    }
  }, [props.t1])

  //LANGUAGE USE EFFECT [props.l1]
  useEffect(() => {

    if(props.l1 == "de") {

      setLanguageTags({
        headText: "Bitte schreiben Sie Ihre Anfrage in das Textfeld. Wir werden uns so schnell wie möglich bei Ihnen melden!",
        textField: "Schreiben Sie Ihre Nachricht!",
        buttonText: "NACHRICHT SENDEN",
        errorMessage: "Ihre Nachricht konnte nicht gesendet werden!",
        successMessage: "Ihre Nachricht wurde gesendet!"
      });

    } else if(props.l1 == "it") {

      setLanguageTags({
        headText: "Scrivere il proprio messaggio nel campo di testo. Ci risponderemo il più presto possibile!",
        textField: "Scrivere il proprio messaggio!",
        buttonText: "INVIA MESSAGGIO",
        errorMessage: "Il tuo messaggio non può essere inviato!",
        successMessage: "Il tuo messaggio è stato inviato!"
      });

    } else {

      setLanguageTags({
        headText: "Please simply write your request in the text field. We will get back to you as soon as possible!",
        textField: "Type your message!",
        buttonText: "SEND MESSAGE",
        errorMessage: "Your message could not be sent!",
        successMessage: "Your message has been sent!"
      });

    }

  }, [props.l1])
  


  const getInputValue = (event) => {
    contactInput = event.target.value;
  };


const handleCloseErrorSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenErrorSnack(false);
};
const handleCloseSuccessSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setOpenSuccessSnack(false);
};

  
    return (
        <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
          {loggedIn ? 
            <div>
            <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
          
            <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2} />
            <div id="rand" style={{marginTop: "calc(16.5px + 3.2em)"}}>
              <div>
                <h4>{languageTags.headText}</h4>
              </div>
            
                <div>
                  <TextareaAutosize
                    maxLength={500}
                    aria-label="minimum height"
                    minRows={12}
                    placeholder={languageTags.textField}
                    style={{backgroundColor: colorTextfield, color: colorFontTextfield, width: "calc(100% - 10px)", marginTop: "10px", marginBottom: "5px", resize: "none", fontSize:"large", paddingLeft: "5px", paddingRight: "5px", paddingTop: "5px", paddingBottom:"5px"}}
                    onChange={getInputValue}
                    
                  />  
                </div>
                <div>
                  <Button  style={{width: "100%",  height: "43px"}} variant="contained" onClick={() => contactInput.length > 0 ? sendContactMessage(setOpenErrorSnack, setOpenSuccessSnack) : console.log("errro")}>{languageTags.buttonText}</Button>
            
              </div>
              </div>

              <ErrorSnackbar openErrorSnack={openErrorSnack} errorMessage={languageTags.errorMessage} handleClose={handleCloseErrorSnackbar} ></ErrorSnackbar>
              <SuccessSnackbar openSuccessSnack={openSuccessSnack} successMessage={languageTags.successMessage} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
          
              </Card>
            </div>
          : null}
        </ThemeProvider>
    );
  
}

function sendContactMessage(setOpenErrorSnack, setOpenSuccessSnack) {

  let formData = new FormData();
  formData.append('content', contactInput);

  fetch("http://10.10.30.18:5000/report", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
      if (res.status == 400) {
          console.log("fehler")
          
          setOpenErrorSnack(false)
      } else {
          // Infofeld sichtbar machen
          setOpenSuccessSnack(true)         
      }
  });

}


export default Contact;