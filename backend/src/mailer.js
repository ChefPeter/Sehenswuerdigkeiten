require("dotenv").config();
const SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SEND_IN_BLUE_API_KEY;

class Mailer {
    sendRegisterEmail(username, email, token) {
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
            "sender":{ 
                "email":"sendinblue@sendinblue.com",
                "name":"Sendinblue"
            },
            "subject":"This is my default subject line",
            "htmlContent":"<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
            "messageVersions": [{
                "to": [
                    {
                        "email":"schatzer.lukas@gmail.com",
                        "name":"Lukas Schatzer"
                     }
                ]
            }]
        });
    }
}

module.exports = Mailer;