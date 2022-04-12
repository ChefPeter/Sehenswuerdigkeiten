export async function checkCurrentlyLoggedIn(){
    await fetch("https://10.10.30.18:8444/logged-in", {
      method: "GET",
      credentials: "include"
    })
    .then(res => {
        if(res.status === 200){
            return true;
        }else{
            window.location.href="/login";
            return false;
        }
    }).catch(err => {
            window.location.href="/login";
            return false;
    });
}

export function autoLogin(){
    fetch("https://10.10.30.18:8444/logged-in", {
      method: "GET",
      credentials: "include"
    })
    .then(res => {
        if(res.status === 200){
            window.location.href="/home";
            return true;
        }else{
            return false;
        }
   });
}