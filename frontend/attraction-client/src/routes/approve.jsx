import { Button, Paper } from '@mui/material';
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles/start.css";

function Approve(props) {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

        const email = searchParams.get("email");
        const token = searchParams.get("token");
        // Update the document title using the browser API
        let formData = new FormData();
        formData.append('email', email);
        formData.append('approved-token', token);

        fetch("http://10.10.30.18:5000/approve", {
            method: "post",
            body: formData
        }).then(res => res.text())
        .then(res => console.log(res));

      });

    return (
        
        <Paper variant="outlined" elevation={4}>Deine Email wurde bestätigt! <Button variant="contained" onClick={() => navigate("/login")}>Zum Login</Button></Paper>
        
    );
  
}



export default Approve;