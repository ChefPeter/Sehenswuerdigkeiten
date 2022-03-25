import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useSelector } from 'react-redux';
import "../routes/styles/contact.css";
import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button} from '@mui/material';
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



  const theme = useSelector(state => {
    try{
      return state.theme;
    }catch(e){
      return "dark";
    }
  });
  const language = useSelector(state => {
    try{
      return state.language;
    }catch(e){
      return "de";
    }
  });
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
      <div>
        <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
        <Header/>
        <div id="rand">
          <div>
            <h4>Bitte schreibe dein Anliegen einfach in das Feld. Wir werden uns so schnell wie möglich bei Ihnen melden!</h4>
          </div>
         
            <div>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={12}
                placeholder="Type your message!"
                style={{ width: "100%", marginTop: "10px", marginBottom: "10px", resize: "none", fontSize:"large"}}
                onChange={getInputValue}
              />  
            </div>
            <div>
              <Button  style={{width: "100%",  height: "43px"}} variant="contained" onClick={() => sendContactMessage(setOpenErrorSnack, setOpenSuccessSnack)}>Absenden</Button>
         
          </div>
          </div>

          <ErrorSnackbar openErrorSnack={openErrorSnack} errorMessage={"Your message wasn't sent!"} handleClose={handleCloseErrorSnackbar} ></ErrorSnackbar>
          <SuccessSnackbar openSuccessSnack={openSuccessSnack} successMessage={"Your message has been sent!"} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
      

        </ThemeProvider>
      </div>
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