import React from "react";
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField, Container, Box } from "@mui/material";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { maxHeight } from "@mui/system";
import StopIcon from '@mui/icons-material/Stop';
import {useState} from 'react';

let message = "";

function ChatSendbar (props) {

    const [hideButton, setHideButton] = useState(true);

    const checkMessageInput = (event) => {
        message = event.target.value;
    };

    const sendMessage = (event) => {

        let formData = new FormData();
        formData.append('recipient', props.name);
        formData.append('content', message);

        fetch("http://localhost:5000/send-message", {
            method: "post",
            body: formData,
            credentials: 'include'
        });

    }

    const recordAudio = (event) => {

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
                let blob = new Blob(recordedChunks);
                let file = new File(recordedChunks, "file.mp3", {
                    type: "audio/mp3"
                });
                let container = new DataTransfer();
                container.items.add(file);
                console.log(container);
                document.getElementById("audioUpload").files = container.files;
                //document.getElementById("audioUpload").value = URL.createObjectURL(new Blob(recordedChunks));
                console.log("Bis do geats!");
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
        formData.append('file', document.getElementById("pictureUpload").files[0]);
        formData.append('recipient', props.name);

        fetch("http://localhost:5000/send-message", {
            method: "post",
            body: formData,
            credentials: 'include'
        }).then(res => res.text())
        .then(res => console.log(res))
    } 

    const sendAudio = (audio) => {
        //console.log(document.getElementById("audioUpload").files);
        console.log(audio);
        let formData = new FormData();
        formData.append('file', audio);
        formData.append('recipient', props.name);

        fetch("http://localhost:5000/send-message", {
            method: "post",
            body: formData,
            credentials: 'include'
        }).then(res => res.text())
        .then(res => console.log(res))
    }

    return (
        <Container>
        
            <TextField
                
                style={{width:"60%"}}
                id="chatMessageInput"
                type="text"
                label="Type a message!"
                
                onChange={checkMessageInput}
                InputProps={{endAdornment: <Button onClick={sendMessage}><SendIcon/></Button> }}
            />
            <input onChange={sendPicture} hidden type="file" id="pictureUpload" accept="image/*;capture=camera" />
            <input onChange={sendAudio} hidden id="audioUpload" />

            {hideButton ? 
                <Button onClick={recordAudio} style={{width:"5%"}}><KeyboardVoiceIcon fontSize="large"></KeyboardVoiceIcon></Button>
            : null}

            {hideButton ?
                <Button id="stop"><StopIcon fontSize="large"></StopIcon></Button>
            : null}

            <Button onClick={() => document.getElementById("pictureUpload").click()} style={{width:"5%"}}><InsertPhotoIcon fontSize="large"></InsertPhotoIcon></Button>
            
        </Container>
    );


}


export default ChatSendbar;