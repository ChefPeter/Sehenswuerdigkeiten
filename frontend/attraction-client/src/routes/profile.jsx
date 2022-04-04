import { Button, Card, Switch, Toolbar, Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import ErrorSnackbar from "../components/ErrorSnackbar";
import Sidebar from "../components/Sidebar";
import SuccessSnackbar from '../components/SuccessSnackbar';
import "../routes/styles/profile.css";
import { Checkbox, FormControlLabel } from '@mui/material';
import { Tooltip } from '@mui/material';
import Zoom from '@mui/material/Zoom';
import SaveIcon from '@mui/icons-material/Save';
import Save from '@mui/icons-material/Save';
import { CircularProgress } from '@mui/material';

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
let lastShowLocation = false;
let currentShowLocation = false;

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
  const [buttonTextTag, setButtonTextTag] = useState("SAVE");
  const [showLocationTag, setShowLocationTag] = useState("Show my location to friends");
  const [showLocationTooltipTag, setShowLocationTooltipTag] = useState("If you activate this setting your friends will see your live location. (Only works if you use the location tool on the map.)");


  const [showMyLocationToFriends, setShowMyLocationToFriends] = useState(false);
  const [showLoading, setShowLoading] = useState(false);


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
      setShowLocationTag("Zeig meinen Freunden meine Position");
      setShowLocationTooltipTag("Sollte diese Einstellung aktiviert sein, wird deine Live Position deinen Freunden angezeigt. (Funktioniert nur, wenn das Positionstool auf der Karte verwendet wird.)");
      if(descriptionLabel !== "") setDescriptionLabel("Beschreibung");
    } else if(props.l1 == "it") {
      setButtonTextTag("SALVARE");
      setShowLocationTag("Mostrare la mia posizione agli amici");
      setShowLocationTooltipTag("Se attivi questa impostazione i tuoi amici vedranno la tua posizione dal vivo. (Funziona solo se usi lo strumento di localizzazione sulla mappa).");
      if(descriptionLabel !== "") setDescriptionLabel("Discrizione");
    } else {
      setButtonTextTag("SAVE");
      setShowLocationTag("Show my location to friends");
      setShowLocationTooltipTag("If you activate this setting your friends will see your live location. (Only works if you use the location tool on the map.)");
      if(descriptionLabel !== "") setDescriptionLabel("Description");
    }

  }, [props.l1]);


  useEffect(async() => {
   
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
      const activatedLocation = await fetch("http://localhost:5000/visibility",{
        method: "get",
        credentials: "include"
      });

      let description2 = (await resultDescription.text());
      let file = (await fileProfilePicture.blob());
      let activatedLocationText = (await activatedLocation.text());
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
      if(activatedLocationText == "true"){
        setShowMyLocationToFriends(true)
        currentShowLocation = true;
        lastShowLocation = true;
      }else{
        setShowMyLocationToFriends(false)
        currentShowLocation = false;
        lastShowLocation = false;
      }

  },[]);
  

  const getDescriptionValue = (event) => {
    setDidChangeDescription(true);
    descriptionInput = event.target.value;
  };
 
  function saveShowLocation(){

    if(currentShowLocation != lastShowLocation){
      //save new value
      setShowError(false);
      setShowInfo(false);

      //send data to server...
      let formData = new FormData();
      formData.append('value', currentShowLocation);
 
      fetch("http://localhost:5000/change-visibility", {
          method: "post",
          body: formData,
          credentials: 'include'
      }).then(res => {
        if (res.status == 400 || res.status == 401) { //error
          if(props.l1 === "de")
            setErrorDescription("Fehler!");
          else if(props.l1 === "it")
            setErrorDescription("Errore!");
          else
            setErrorDescription("Error!");
          setShowError(true)
        } else {          
            if(props.l1 === "de")
              setSuccessDescription("Geändert!");
            else if(props.l1 === "it")
              setSuccessDescription("Cambiato!");
            else
              setSuccessDescription("Updated!");
            setShowInfo(true);
        }
      });
      lastShowLocation = currentShowLocation;
    }

  }

  function changedCheckBox(value){
    currentShowLocation = value;
    setShowMyLocationToFriends(value);
  }


    return (
    
        <ThemeProvider theme={createTheme(props.t1 === "dark" ? dark : light)}>
        <Card style={{minHeight: "100vh", borderRadius:"0px"}}>
        <Sidebar t1={props.t1} t2={props.t2} l1={props.l1} l2={props.l2}/>
        <div id='description' style={{marginTop: "calc(16.5px + 3.5em)"}}>

          { false ?
            <TextField type="file" ></TextField>
          : null}
           <input type="file" id="fileInputUpload" hidden onChange={() => handleFileUpload(setShowInfo, setShowError, setSuccessDescription, setErrorDescription, props.l1, setProfilePicture)} ></input>
        
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
                    <Button fullWidth style={{height: "43px"}} onClick={() => handleSaveNewDescription(descriptionInput ,setShowInfo,setShowError, setSuccessDescription, setErrorDescription, didChangeDescription,  setDidChangeDescription, props.l1, setShowLoading)} variant="contained"> {showLoading ? <CircularProgress size={25} color='inherit'/> : buttonTextTag} </Button>
                    <Box sx={{mt:2.5, pt:1, pb:1}} elevation={0} style={{display:"flex"}}> 
                      <FormControlLabel  control={<Tooltip placement="bottom" disableFocusListener enterTouchDelay={50}  title={showLocationTooltipTag} TransitionComponent={Zoom} arrow>
                          <Checkbox onChange={(e) => changedCheckBox(e.target.checked)} checked={showMyLocationToFriends} /></Tooltip> } label={showLocationTag} /> 
                      <Button variant="contained" sx={{width:"6ch", height:"6ch"}} onClick={() => saveShowLocation()}><SaveIcon /></Button>
                    </Box>
                </div>
            </div>
            
        </div>
        

        <SuccessSnackbar openSuccessSnack={showInfo} successMessage={successDescription} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
        <ErrorSnackbar openSuccessSnack={showError} successMessage={errorDescription} handleClose={handleCloseErrorSnackbar}></ErrorSnackbar>
         
    
        </Card>
        </ThemeProvider>
      
    );
  
}

function handleFileUpload(setShowInfo, setShowError, setSuccessDescription, setErrorDescription, language, setProfilePicture){
  setShowInfo(false);
  setShowError(false);

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
        //sets new src via prop
        setProfilePicture( URL.createObjectURL(document.getElementById("fileInputUpload").files[0]));
        
        if(language === "de")
          setSuccessDescription("Profilbild geändert!");
        else if(language === "it")
          setSuccessDescription("La foto del profilo è cambiata!");
        else
          setSuccessDescription("Profile picture updated!");

        setShowInfo(true);
    }
  });

  

}

function handleSaveNewDescription(description, setShowInfo, setShowError, setSuccessDescription, setErrorDescription, didChangeDescription, setDidChangeDescription, language, setShowLoading) {
 
  setShowError(false);
  setShowInfo(false);
  if(!didChangeDescription)
    return;

  setShowLoading(true);

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
    setShowLoading(false);
  });
 


}


export default Profile;