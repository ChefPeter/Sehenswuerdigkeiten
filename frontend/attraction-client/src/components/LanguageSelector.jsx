import { FormControl, MenuItem, Select, InputLabel, Box } from "@mui/material";
import React from "react";
import { useEffect } from "react/cjs/react.production.min";
import { connect } from "react-redux";
import store from "../reducers/store";
import { useSelector } from "react-redux";
import "./styles/languageselect.css"


function LanguageSelector() {

  const language_given = useSelector(state => {
    try{
      return state.language;
    }catch(e){
      return "de";
    }
  });
    const [language, setLanguage] = React.useState(language_given);

    const handleChange = (event) => {
        setLanguage(event.target.value);
        console.log(event.target.value)
        const changeTheme = { type: 'CHANGE_LANGUAGE', language: event.target.value};
        store.dispatch(changeTheme) 
        console.log("change")
    };

    return(
     <Box >
      <FormControl id="languageSelectorStyle" >
        <InputLabel id="demo-simple-select-label">Language</InputLabel>
        <Select
         
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          label="Language"
          onChange={handleChange}
        >
          <MenuItem value={"de"}>Deutsch</MenuItem>
          <MenuItem value={"en"}>English</MenuItem>
          <MenuItem value={"it"}>Italiano</MenuItem>
        </Select>
      </FormControl>
     </Box>
    );

}

const initState = {
    language: "de"
}

const mapStatesToProps = (state = initState) => {
    return {
      language: state.language
    }  
}
  

export default connect(mapStatesToProps)(LanguageSelector);