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
  const [usedEffect, setUsedEffect] = useState(false)

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
      let description = (await resultDescription.text());
      console.log(fileProfilePicture);
      let file = (await fileProfilePicture.blob());
    

      setUsername(username);
      setDescription(description);
      setProfilePicture(URL.createObjectURL(file));
      setUsedEffect(true);

    }

    if(description.length === 0){
      setDescriptionLabel("Description");
    }

    
  });
  

  const getDescriptionValue = (event) => {
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
           <input type="file" id="fileInputUpload" hidden onChange={() => handleFileUpload()} ></input>
        
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
                    <Button onClick={() => handleSaveNewDescription(descriptionInput ,setShowInfo)} variant="contained">Speichern</Button>
                </div>
            </div>
        </div>
        <div id='notice'>

          { showInfo ?
            <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
                Ihr Statuts wurde aktualisiert.
            </Alert>
          : null }
        </div>
        </ThemeProvider>
      </div>
    );
  
}

function handleFileUpload(){

  console.log("fire")
  let formData = new FormData();
  
  formData.append('profile-picture', document.getElementById("fileInputUpload").files[0]);

  fetch("http://localhost:5000/change-profile-picture", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => res.text())
  .then(res => console.log(res));


}

function handleSaveNewDescription(description, setShowInfo) {

  let formData = new FormData();
  
  formData.append('description', description);

  fetch("http://localhost:5000/change-description", {
      method: "post",
      body: formData,
      credentials: 'include'
  }).then(res => {
    if (res.status !== 400) {
        setShowInfo(true);
        setTimeout(() => setShowInfo(false), 1000);
    } 
  });
 
 

}


export default Profile;