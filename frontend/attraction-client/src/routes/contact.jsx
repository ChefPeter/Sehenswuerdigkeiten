import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useSelector } from 'react-redux';
import "../routes/styles/contact.css";
import Header from "../components/header";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button} from '@mui/material';

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

function Contact(props) {

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

    return (
      <div id='bild'>
        <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
        <Header/>
        <div id="rand">
          <div>
            <h4>Bitte schreibe dein Anliegen einfach in das Feld. Wir werden uns so schnell wie möglich bei Ihnen melden!</h4>
          </div>
          <div id='textarea' >
            <div>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={8}
                placeholder="Hier schreiben"
                style={{ width: 1000 }}
              />  
            </div>
          </div>
          <div>
              <Button variant="text">Absenden</Button>
          </div>     
          <div id='copyright'>
            <h6>Alle Inahlte unterliegen der City2Go gmbh und sind stregstens geschützt. Bei Kopie oder Diebstahl wird dies zur Anzeige gebracht. Alle Daten sind nach der aktuellen DSGVO geschützt und gesichert.</h6>
          </div>
          </div>
        </ThemeProvider>
      </div>
    );
  
}
export default Contact;