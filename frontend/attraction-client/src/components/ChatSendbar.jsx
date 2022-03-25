import React from "react";
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField, Container, Box } from "@mui/material";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { maxHeight } from "@mui/system";

let message = "";

function ChatSendbar () {

    const checkMessageInput = (event) => {
        message = event.target.value;
    };

 

    return (
        <Container>
        <TextField
                
                style={{width:"60%"}}
                id="chatMessageInput"
                type="text"
                label="Type a message!"
                
                onChange={checkMessageInput}
                InputProps={{endAdornment: <Button onClick={() => console.log("dwqqw")}><SendIcon/></Button> }}
            />
            <Button style={{width:"5%"}}><KeyboardVoiceIcon fontSize="large"></KeyboardVoiceIcon></Button>
            <Button style={{width:"5%"}}><InsertPhotoIcon fontSize="large"></InsertPhotoIcon></Button>

        </Container>
    );


}


export default ChatSendbar;