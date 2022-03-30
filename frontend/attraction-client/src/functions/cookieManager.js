export function setCookie(cname, cvalue, exdays=31) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

export function checkCookie(cname) {
    let cookie = getCookie(cname);
    //cookie exists
    if (cookie != "") {
        return cookie;
    }
    //cookie doesnt exist 
    else {
      
        if(cname === "theme"){
            setCookie(cname, getUserDefaultTheme());
        }else if(cname === "language"){
            setCookie(cname, getUserDefaultLanguage());
        }
      
    }
    
}


function getUserDefaultLanguage(){
    const lang = navigator.language;
    if(lang === "de")
        return "de";
    else if(lang === "it")
        return "it";
    else
        return "en";
}

function getUserDefaultTheme(){

    if (window.matchMedia) {
        // Check if the dark-mode Media-Query matches
        if(window.matchMedia('(prefers-color-scheme: dark)').matches)
            return "dark";
        else 
            return "light";
    } else {
        // Default (when Media-Queries are not supported)
        return "light";
    }

}

