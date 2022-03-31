import { Button, Card } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import ErrorSnackbar from "../components/ErrorSnackbar";
import Sidebar from "../components/Sidebar";
import SuccessSnackbar from '../components/SuccessSnackbar';
import "../routes/styles/profile.css";

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

let descriptionInput = "";

function Profile(props) {

  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionLabel, setDescriptionLabel] = useState("");
  const [profilePicture, setProfilePicture] = useState();
  const [showInfo, setShowInfo] = useState(false);
  const [showError, setShowError] = useState(false);
  const [didChangeDescription, setDidChangeDescription] = useState(false);
  const [successDescription, setSuccessDescription] = useState("Success!");
  const [errorDescription, setErrorDescription] = useState("Error!");
  const [buttonTextTag, setButtonTextTag] = useState("SAVE")

  const  handleCloseSuccessSnackbar = (event, reason) =>  {
    if (reason === 'clickaway') {
      return;
    }
    setShowInfo(false);
  };
  const  handleCloseErrorSnackbar = (event, reason) =>  {
    if (reason === 'clickaway') {
      return;
    }
    setShowError(false);
  };

  useEffect(() => {
    //language was changed
    if(props.l1 == "de") {
      setButtonTextTag("SPEICHERN");
      if(descriptionLabel !== "") setDescriptionLabel("Beschreibung");
    } else if(props.l1 == "it") {
      setButtonTextTag("SALVARE");
      if(descriptionLabel !== "") setDescriptionLabel("Discrizione");
    } else {
      setButtonTextTag("SAVE");
      if(descriptionLabel !== "") setDescriptionLabel("Description");
    }

  }, [props.l1]);


  useEffect(async() => {
    console.log("hallalaop")
   
      const resultUsername = await fetch("http://localhost:5000/username", {
        method: "get",
        credentials: 'include'
      });
      const resultDescription = await fetch("http://localhost:5000/description", {
        method: "get",
        credentials: 'include'
      });
      const fileProfilePicture = await fetch("http://localhost:5000/profile-picture", {
        method: "get",
        credentials: 'include'
      });

      let description2 = (await resultDescription.text());
      let file = (await fileProfilePicture.blob());

      setUsername(await resultUsername.text());
      setDescription(description2);
      if(description2.length === 0){
        if(props.l1 == "de") {
          setDescriptionLabel("Beschreibung");
        } else if(props.l1 == "it") {
          setDescriptionLabel("Discrizione");
        } else {
          setDescriptionLabel("Description");
        }
      }
      setProfilePicture(URL.createObjectURL(file));

  },[]);
  

  const getDescriptionValue = (event) => {
    setDidChangeDescription(true);
    descriptionInput = event.target.value;
  };
 


    return (
    
        <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
        <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
        <div id='description' style={{marginTop: "calc(16.5px + 3.5em)"}}>

          { false ?
            <TextField type="file" ></TextField>
          : null}
           <input type="file" id="fileInputUpload" hidden onChange={() => handleFileUpload(setShowInfo, setShowError, setSuccessDescription, setErrorDescription, props.l1)} ></input>
        
            <div id='profil'>
              
                <Avatar alt="Avatar" src={profilePicture} onClick={() => document.getElementById("fileInputUpload").click()}
                    sx={{ width: 80, height: 80 }}
                />
            </div>
            <div id='unten'>
                <div>
                    <h2>{username}</h2>
                </div>
                <div id='abstand'>
                    <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        label={descriptionLabel}
                        multiline
                        rows={4}
                        defaultValue={description}
                        onChange={getDescriptionValue}/>
                </div>
                <div>
                    <Button fullWidth style={{height: "43px"}} onClick={() => handleSaveNewDescription(descriptionInput ,setShowInfo,setShowError, setSuccessDescription, setErrorDescription, didChangeDescription,  setDidChangeDescription, props.l1)} variant="contained">{buttonTextTag}</Button>
                </div>
            </div>
        </div>
        <div id='notice'>

        <SuccessSnackbar openSuccessSnack={showInfo} successMessage={successDescription} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
        <ErrorSnackbar openSuccessSnack={showError} successMessage={errorDescription} handleClose={handleCloseErrorSnackbar}></ErrorSnackbar>
         
        </div>
        </Card>
        </ThemeProvider>
      
    );
  
}

function handleFileUpload(setShowInfo, setShowError, setSuccessDescription, setErrorDescription, language){
  setShowInfo(false);
  setShowError(false)

  let formData = new FormData();
  
  formData.append('profile-picture', document.getElementById("fileInputUpload").files[0]);

  fetch("http://localhost:5000/change-profile-picture", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
    if (res.status == 400 || res.status == 401) { //error

      if(language === "de")
        setErrorDescription("Fehler beim Ändern des Profilbilds!");
      else if(language === "it")
        setErrorDescription("Errore durante la modifica dell'immagine del profilo!");
      else
        setErrorDescription("Error while changing the profile picture!");
      setShowError(true)

    } else{
        
        if(language === "de")
          setSuccessDescription("Profilbild geändert!");
        else if(language === "it")
          setSuccessDescription("La foto del profilo è cambiata!");
        else
          setSuccessDescription("Description updated!");

        setShowInfo(true);
    }
  });

  

}

function handleSaveNewDescription(description, setShowInfo, setShowError, setSuccessDescription, setErrorDescription, didChangeDescription, setDidChangeDescription, language) {

  setShowError(false);
  setShowInfo(false);
  if(!didChangeDescription)
    return;

  let formData = new FormData();
  
  formData.append('description', description);

  fetch("http://localhost:5000/change-description", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
    if (res.status != 400 && res.status != 401) {

        setDidChangeDescription(false)
        
        if(language === "de")
          setSuccessDescription("Beschreibung aktualisiert!");
        else if(language === "it")
          setSuccessDescription("Descrizione aggiornata!");
        else
          setSuccessDescription("Description updated!");

        setShowInfo(true);

    }else{
      
      if(language === "de")
        setErrorDescription("Fehler beim Ändern der Beschreibung!");
      else if(language === "it")
        setErrorDescription("Errore durante la modifica della descrizione!");
      else
        setErrorDescription("Error while changing the description!");
      setShowError(true)

    } 
  });
 
  

}


export default Profile;