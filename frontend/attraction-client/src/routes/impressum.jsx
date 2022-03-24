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

function Impressum(props) {

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
      <div>
        <ThemeProvider theme={createTheme(theme === "dark" ? dark : light)}>
        <Header/>
        <div id="rand">
            <h1>Impressum</h1>
            <br />
            <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
            <p>City2Go GmbH<br />
            Dantestra&szlig;e, 39E<br />
            Geb&auml;ude 44<br />
            39042 Brixen</p>

            <p><strong>Vertreten durch:</strong><br />
            City2Go GmbH<br />
            Dantestra&szlig;e, 39E, 39042 Brixen, Autonome Provinz</p>

            <p>Diese vertreten durch:<br />
            &#91;Namen der Gesch&auml;ftsf&uuml;hrer der GmbH&#93;</p>

            <p>Handelsregister: &#91;Nummer des Registereintrags&#93;<br />
            Registergericht: Amtsgericht Bozen</p>
            <br />
            <h2>Kontakt</h2>
            <p>Telefon: &#91;Telefonnummer&#93;<br />
            E-Mail: city2go.gmbh@gmail.com</p>
            <br />
            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>Berufsbezeichnung:<br />
            Programmierer</p>
            <p>Zust&auml;ndige Kammer:<br />
            Peter Costadedoi<br />
            Lukas Gallmetzer<br />
            Noa Pichler<br />
            Nathan Obexer<br />
            Lukas Schatzer<br />
            Philipp Olivotto</p>
            <p>Verliehen in:<br />
            Italien</p>
            <p>Es gelten folgende berufsrechtliche Regelungen:</p>
            <br />
            <h2>EU-Streitschlichtung</h2>
            <p>Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br /> Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            <br />
            <h2>Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>
        </ThemeProvider>
      </div>
    );
  
}
export default Impressum;