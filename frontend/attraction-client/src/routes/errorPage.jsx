import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ErrorPage () {
    const navigate = useNavigate();
    return (<div>404 page not found! Return to <Button variant="contained" onClick={() => navigate("/login")}> Login </Button></div>);

}

export default ErrorPage;