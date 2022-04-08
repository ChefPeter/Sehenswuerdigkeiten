export async function checkCurrentlyLoggedIn(){
    await fetch("http://localhost:5000/logged-in", {
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
   });
}

export function autoLogin(){
    fetch("http://localhost:5000/logged-in", {
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