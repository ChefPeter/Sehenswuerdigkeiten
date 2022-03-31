import "../routes/styles/contact.css";
import Sidebar from "../components/Sidebar";
import { Card } from "@mui/material";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

function LegalNotice(props) {

    return (
 
      <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
        <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
        <div id="rand" style={{marginTop: "calc(16.5px + 3em)"}}>
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
            Lukas Schatzer</p>
            <p>
            Registergericht: Amtsgericht Bozen</p>
            <br />
            <h2>Kontakt</h2>
            <p>
            E-Mail: city2go.gmbh@gmail.com</p>
            <br />
            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p><strong>Berufsbezeichnung:</strong><br />
            Programmierer</p>
            <p><strong>Zust&auml;ndige Kammer:</strong><br />
            Peter Costadedoi<br />
            Lukas Gallmetzer<br />
            Noa Pichler<br />
            Nathan Obexer<br />
            Lukas Schatzer<br />
            Philipp Olivotto</p>
            <p><strong>Verliehen in:</strong><br />
            Italien</p>
            <br />
            <h2>EU-Streitschlichtung</h2>
            <p>Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br /> Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            <br />
            <h2>Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>
          </Card>
        </ThemeProvider>
    
    );
  
}
export default LegalNotice;