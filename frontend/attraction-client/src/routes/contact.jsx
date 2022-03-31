import TextareaAutosize from '@mui/material/TextareaAutosize';
import "../routes/styles/contact.css";
import Sidebar from "../components/Sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, cardClasses} from '@mui/material';
import ErrorSnackbar from '../components/ErrorSnackbar';
import SuccessSnackbar from '../components/SuccessSnackbar';
import React, { useEffect, useState } from "react";


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

  const[headTextTag, setHeadTextTag] = useState("Please simply write your request in the text field. We will get back to you as soon as possible!");
  const[textfieldTag, setTextfieldTag] = useState("Type your message!");
  const[buttonTextTag, setButtonTextTag] = useState("SEND MESSAGE");
  const[errorMessageTag, setErrorMessageTag] = useState("Your message could not be sent!");
  const[successMessageTag, setSuccessMessageTag] = useState("Your message has been sent!");
  
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
    console.log("efffect")
    
    if(props.l1 == "de") {
      setHeadTextTag("Bitte schreibe dein Anliegen einfach in das Textfeld. Wir werden uns so schnell wie möglich bei dir melden!");
      setTextfieldTag("Gib deine Nachricht ein!");
      setButtonTextTag("NACHRICHT ABSENDEN");
      setErrorMessageTag("Deine Nachricht konnte nicht verschickt werden!");
      setSuccessMessageTag("Deine Nachricht wurde verschickt!");
    } else if(props.l1 == "it") {
      setHeadTextTag("Per favore, scrivi semplicemente la tua richiesta nel campo di testo. Vi risponderemo il più presto possibile!");
      setTextfieldTag("Scrivi il tuo messaggio");
      setButtonTextTag("INVIA MESSAGGIO");
      setErrorMessageTag("Il tuo messaggio non può essere inviato!");
      setSuccessMessageTag("Il tuo messaggio è stato inviato!");
    } else {
      setHeadTextTag("Please simply write your request in the text field. We will get back to you as soon as possible!");
      setTextfieldTag("Type your message!");
      setButtonTextTag("SEND MESSAGE");
      setErrorMessageTag("Your message could not be sent!");
      setSuccessMessageTag("Your message has been sent!");
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
        
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
       
        <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2} />
        <div id="rand" style={{marginTop: "calc(16.5px + 3.2em)"}}>
          <div>
            <h4>{headTextTag}</h4>
          </div>
         
            <div>
              <TextareaAutosize
                maxLength={500}
                aria-label="minimum height"
                minRows={12}
                placeholder={textfieldTag}
                style={{backgroundColor: colorTextfield, color: colorFontTextfield, width: "calc(100% - 10px)", marginTop: "10px", marginBottom: "5px", resize: "none", fontSize:"large", paddingLeft: "5px", paddingRight: "5px", paddingTop: "5px", paddingBottom:"5px"}}
                onChange={getInputValue}
                
              />  
            </div>
            <div>
              <Button  style={{width: "100%",  height: "43px"}} variant="contained" onClick={() => contactInput.length > 0 ? sendContactMessage(setOpenErrorSnack, setOpenSuccessSnack) : console.log("errro")}>{buttonTextTag}</Button>
         
          </div>
          </div>

          <ErrorSnackbar openErrorSnack={openErrorSnack} errorMessage={errorMessageTag} handleClose={handleCloseErrorSnackbar} ></ErrorSnackbar>
          <SuccessSnackbar openSuccessSnack={openSuccessSnack} successMessage={successMessageTag} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
      
          </Card>
        </ThemeProvider>
    );
  
}

function sendContactMessage(setOpenErrorSnack, setOpenSuccessSnack) {

  let formData = new FormData();
  formData.append('content', contactInput);

  fetch("http://localhost:5000/report", {
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