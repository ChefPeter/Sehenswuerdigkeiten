import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { Button, Container, TextField, Box } from "@mui/material";
import React, { useState } from "react";


function ChatSendbar (props) {

    const [message, setMessage] = useState("");
    const [currentlyRecordingAudio, setCurrentlyRecordingAudio] = useState(false);

    const checkMessageInput = (event) => {
        //message = event.target.value;
        setMessage(event.target.value);
    };

    const sendMessage = (event) => {
        if(message.length === 0){
            return;
        }
        let formData = new FormData();
        if (!props.isGroup) {
            formData.append('recipient', props.name);
            formData.append('content', message);

            fetch("https://10.10.30.18:8444/send-message", {
                method: "post",
                body: formData,
                credentials: 'include'
            });
        } else {
            formData.append('group_id', props.groupID);
            formData.append('content', message);

            fetch("https://10.10.30.18:8444/send-group-message", {
                method: "post",
                body: formData,
                credentials: 'include'
            });
        }
        setMessage("");
    }

    const recordAudio = (event) => {
        setCurrentlyRecordingAudio(true);
        //setHideButton(!hideButton);
        const stopButton = document.getElementById("stop");

        const handleSuccess = function(stream) {
            const options = {mimeType: 'audio/webm'};
            const recordedChunks = [];
            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.addEventListener('dataavailable', function(e) {
                if (e.data.size > 0) recordedChunks.push(e.data);
            });

            mediaRecorder.addEventListener('stop', function() {
                setCurrentlyRecordingAudio(false);
                let blob = new Blob(recordedChunks);
                let file = new File(recordedChunks, "file.mp3", {
                    type: "audio/mp3"
                });
                let container = new DataTransfer();
                container.items.add(file);
                document.getElementById("audioUpload").files = container.files;
                //document.getElementById("audioUpload").value = URL.createObjectURL(new Blob(recordedChunks));
                sendAudio(file);
                //downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
                //downloadLink.download = 'acetest.wav';
            });

            stopButton.addEventListener('click', function() {
                //setHideButton(!hideButton);
                mediaRecorder.stop();
            });

            mediaRecorder.start();
        };

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(handleSuccess);
    }

    const sendPicture = (event) => {
        let formData = new FormData();
        if (!props.isGroup) {
            formData.append('file', document.getElementById("pictureUpload").files[0]);
            formData.append('recipient', props.name);

            fetch("https://10.10.30.18:8444/send-message", {
                method: "post",
                body: formData,
                credentials: 'include'
            })
        } else {
            formData.append('file', document.getElementById("pictureUpload").files[0]);
            formData.append('group_id', props.groupID);

            fetch("https://10.10.30.18:8444/send-group-message", {
                method: "post",
                body: formData,
                credentials: 'include'
            })
        }
    } 

    const sendAudio = (audio) => {
        let formData = new FormData();
        if (!props.isGroup) {
            formData.append('file', audio);
            formData.append('recipient', props.name);

            fetch("https://10.10.30.18:8444/send-message", {
                method: "post",
                body: formData,
                credentials: 'include'
            });
        } else {
            formData.append('file', audio);
            formData.append('group_id', props.groupID);

            fetch("https://10.10.30.18:8444/send-group-message", {
                method: "post",
                body: formData,
                credentials: 'include'
            });
        }
    }

    return (
        <Container>
        
            <TextField
                inputProps={{ maxLength: 9999 }}
                fullWidth
                id="chatMessageInput"
                type="text"
                label={props.labelField}
                value={message}
                onChange={checkMessageInput}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                      e.preventDefault();
                }}}
                InputProps={{endAdornment: <Button onClick={sendMessage}><SendIcon/></Button> }}
            />
            <input onChange={sendPicture} hidden type="file" id="pictureUpload" accept="image/*;capture=camera" />
            <input onChange={sendAudio} hidden id="audioUpload" />
            
            <Box style={{width:"100%", marginTop:"5px"}} >
       
                <Button onClick={currentlyRecordingAudio ? null : recordAudio} id={!currentlyRecordingAudio ? "stop" : null} style={{width:"5%"}}> {currentlyRecordingAudio ?  <KeyboardVoiceIcon fontSize="large" color="error"/> :  <KeyboardVoiceIcon fontSize="large" />} </Button>
           
                <Button  onClick={() => document.getElementById("pictureUpload").click()} style={{width:"5%"}}><InsertPhotoIcon fontSize="large"></InsertPhotoIcon></Button>
            </Box>
        </Container>
    );


}


export default ChatSendbar;