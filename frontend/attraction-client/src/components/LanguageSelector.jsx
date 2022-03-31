import { FormControl, MenuItem, Select, InputLabel, Box } from "@mui/material";
import React from "react";
import "./styles/languageselect.css"
import {getCookie, setCookie} from "../functions/cookieManager";

function LanguageSelector(props) {


  function LanguageLabel(){
    if(props.l1 === "de"){
      return <InputLabel id="demo-simple-select-label">Sprache</InputLabel>;
    }else if(props.l1 === "it"){
      return <InputLabel id="demo-simple-select-label">Lingua</InputLabel>;
    }else{
      return <InputLabel id="demo-simple-select-label">Language</InputLabel>;
    }
  }

    function onLanguageSelect(event){
        props.l2(event.target.value);
      //change Cookies
      setCookie("language",event.target.value, 31)
    }

    return(
     <Box >
      <FormControl id="languageSelectorStyle" >

        <LanguageLabel />
      
        <Select
         
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.l1}
          label="Language"
          onChange={(event) => onLanguageSelect(event)}
        >
          <MenuItem value={"de"}>Deutsch</MenuItem>
          <MenuItem value={"en"}>English</MenuItem>
          <MenuItem value={"it"}>Italiano</MenuItem>
        </Select>
      </FormControl>
     </Box>
    );

}



export default LanguageSelector;