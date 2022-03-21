import { ThemeProvider } from "@emotion/react";
import { Link } from "react-router-dom";
import Header from "../components/header"
import "./start.css"


export default function Start() {

    return (
      
      <main style={{ padding: "0 0" }}>
     
        <Header></Header>
        <h2>Du befindest dich auf der Startseite.</h2>
        <Link to="/">Home</Link>
        <div id="test"></div>
       
      </main>
     
    );
  }