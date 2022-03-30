import TextareaAutosize from '@mui/material/TextareaAutosize';
import "../routes/styles/contact.css";
import Sidebar from "../components/Sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Card, cardClasses} from '@mui/material';
import ErrorSnackbar from '../components/ErrorSnackbar';
import SuccessSnackbar from '../components/SuccessSnackbar';
import React, { useEffect, useState } from "react";

let color = "#424242";
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

  useEffect(() => {
    (props.t1 === "dark" ? color = "#f5f5f5" : color="#424242")


  });
  


    return (
        <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
       
        <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2} />
        <div id="rand" style={{marginTop: "calc(16.5px + 3.2em)"}}>
          <div>
            <h4>Bitte schreibe dein Anliegen einfach in das Feld. Wir werden uns so schnell wie möglich bei Ihnen melden!</h4>
          </div>
         
            <div>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={12}
                placeholder="Type your message!"
                style={{backgroundColor: color, width: "calc(100% - 10px)", marginTop: "10px", marginBottom: "5px", resize: "none", fontSize:"large", paddingLeft: "5px", paddingRight: "5px", paddingTop: "5px", paddingBottom:"5px"}}
                onChange={getInputValue}
                
              />  
            </div>
            <div>
              <Button  style={{width: "100%",  height: "43px"}} variant="contained" onClick={() => sendContactMessage(setOpenErrorSnack, setOpenSuccessSnack)}>Absenden</Button>
         
          </div>
          </div>

          <ErrorSnackbar openErrorSnack={openErrorSnack} errorMessage={"Your message wasn't sent!"} handleClose={handleCloseErrorSnackbar} ></ErrorSnackbar>
          <SuccessSnackbar openSuccessSnack={openSuccessSnack} successMessage={"Your message has been sent!"} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
      
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
          console.log("JAWOLL")
         
         
      }
  });

}


export default Contact;