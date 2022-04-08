import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ErrorPage () {
    const navigate = useNavigate();
    return (
        <Box sx={{mt:2}} style={{display:"flex", justifyContent:"center"}}>
            <Typography variant="h4">
            404 page not found! Return to <Button variant="contained" onClick={() => navigate("/login")}><Typography variant="h6"> Login </Typography></Button>
            </Typography>
        </Box>
    );

}

export default ErrorPage;