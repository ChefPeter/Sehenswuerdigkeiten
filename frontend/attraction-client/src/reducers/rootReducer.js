const initState = {
    theme: "dark",
    language: "de"
}

const rootReducer = (state = initState, action) => {
  
    if(action.type === "CHANGE_THEME"){
        
        let newTheme = "light";
        if(state.theme === "light")
            newTheme = "dark";

        return {
            theme: newTheme,
            language: state.language,
        }

    }else if(action.type === "CHANGE_LANGUAGE"){
        
        return {
            theme: state.theme,
            language: action.language,
        }
    }
    else if(action.type === "NONE"){
        return{
            theme: state.theme,
            language: state.language, 
        }
    }
    else{

        console.error("Error at reducer!");

    }
    
} 


export default rootReducer;