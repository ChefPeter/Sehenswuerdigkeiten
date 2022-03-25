import { useSelector } from 'react-redux';
import Header from "../components/header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { Button} from '@mui/material';
import "../routes/styles/profile.css";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React, { useEffect, useState } from "react";
import SuccessSnackbar from '../components/SuccessSnackbar';
import ErrorSnackbar from "../components/ErrorSnackbar"

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
  const [usedEffect, setUsedEffect] = useState(false)
  const [successDescription, setSuccessDescription] = useState("Success!");

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

  useEffect(async() => {

    if(!usedEffect){
      //fetch friend requests
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


      let username = (await resultUsername.text());
      let description2 = (await resultDescription.text());
      let file = (await fileProfilePicture.blob());
    

      setUsername(username);
      setDescription(description2);
      setProfilePicture(URL.createObjectURL(file));
      setUsedEffect(true);

    }

    if(description.length === 0){
      setDescriptionLabel("Description");
    }else{
      setDescriptionLabel("");
    }

    
  });
  

  const getDescriptionValue = (event) => {
    setDidChangeDescription(true);
    descriptionInput = event.target.value;
  };
 

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
        <div id='description'>

          { false ?
            <TextField type="file" ></TextField>
          : null}
           <input type="file" id="fileInputUpload" hidden onChange={() => handleFileUpload(setShowInfo, setShowError, setSuccessDescription)} ></input>
        
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
                        id="outlined-multiline-static"
                        label={descriptionLabel}
                        multiline
                        rows={4}
                        defaultValue={description}
                        onChange={getDescriptionValue}/>
                </div>
                <div>
                    <Button onClick={() => handleSaveNewDescription(descriptionInput ,setShowInfo,setShowError, setSuccessDescription, didChangeDescription)} variant="contained">Speichern</Button>
                </div>
            </div>
        </div>
        <div id='notice'>

        <SuccessSnackbar openSuccessSnack={showInfo} successMessage={successDescription} handleClose={handleCloseSuccessSnackbar}></SuccessSnackbar>
        <ErrorSnackbar openSuccessSnack={showError} successMessage={"Upload fehlgeschlagen!"} handleClose={handleCloseErrorSnackbar}></ErrorSnackbar>
         
        </div>
        </ThemeProvider>
      </div>
    );
  
}

function handleFileUpload(setShowInfo, setShowError, setSuccessDescription){
  setShowInfo(false);
  setShowError(false)

  let formData = new FormData();
  
  formData.append('profile-picture', document.getElementById("fileInputUpload").files[0]);

  fetch("http://localhost:5000/change-profile-picture", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
    if (res.status == 400 || res.status == 401) {
      setShowError(true)
    } else{
        setSuccessDescription("Profilbild aktualisiert!")
        setShowInfo(true);
    }
  });

}

function handleSaveNewDescription(description, setShowInfo, setShowError, setSuccessDescription, didChangeDescription) {
  setShowError(false);
  setShowInfo(false);
  if(!didChangeDescription){
    
    return;
  }

  let formData = new FormData();
  
  formData.append('description', description);

  fetch("http://localhost:5000/change-description", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
    if (res.status != 400 && res.status != 401) {
        setShowInfo(true);
        setSuccessDescription("Beschreibung aktualisiert!")
    } 
  });
 
 

}


export default Profile;