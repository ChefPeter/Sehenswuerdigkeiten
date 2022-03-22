const initState = {
    posts: [
        {id: '1', title: 'Squirtle Laid an Egg', body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur voluptate laborum perferendis, enim repellendus ipsam sunt autem at odit dolorum, voluptatum suscipit iste harum cum magni itaque animi laudantium fugiat'},
        {id: '2', title: 'Charmander Laid an Egg', body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur voluptate laborum perferendis, enim repellendus ipsam sunt autem at odit dolorum, voluptatum suscipit iste harum cum magni itaque animi laudantium fugiat'},
        {id: '3', title: 'a Helix Fossil was Found', body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur voluptate laborum perferendis, enim repellendus ipsam sunt autem at odit dolorum, voluptatum suscipit iste harum cum magni itaque animi laudantium fugiat'}
    ],
    theme: "light",
    language: "de"
}

const rootReducer = (state = initState, action) => {
    
    if(action.type === "CHANGE_THEME"){

        let newTheme = "light";
        if(state.theme === "light")
            newTheme = "dark";

        return {
            theme: newTheme,
            
        }

    }else if(action.type === "CHANGE_LANGUAGE"){



    }else{
        return state;
    }
    
} 


export default rootReducer;