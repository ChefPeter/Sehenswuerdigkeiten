require("dotenv").config();
const queryString = require("query-string");
const fs = require('fs');
const SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SEND_IN_BLUE_API_KEY;

class Mailer {

    sendEmail(recipient, recipientName, subject, sender, senderName, content) {
        const body = {
            "sender":{ 
                "email": sender,
                "name": senderName
            },
            "subject": subject,
            "htmlContent": content,
            "messageVersions": [{
                "to": [
                    {
                        "email": recipient,
                        "name": recipientName
                    }
                ]
            }]
        };
        //console.log(body);
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(body);
    }

    sendRegisterEmail(username, email, token) {
        this.sendEmail(
            email,
            username,
            "Willkommen bei City2Go",
            "no-reply@city2go.com",
            "City2Go",
            fs.readFileSync("./email/register-email.html", 'utf-8').replace(/###HREF###/, 
                "https://"+
                process.env.ENV_HOST+
                "/approve?"+ 
                queryString.stringify({username: username, email: email, token: token})
            )
        );
    }

    sendResetPasswordEmail(username, email, token) {
        this.sendEmail(
            email,
            username,
            "Passwort zurücksetzen",
            "no-reply@city2go.com",
            "City2Go",
            fs.readFileSync("./email/reset-email.html", 'utf-8').replace(/###HREF###/, 
                "https://"+
                process.env.ENV_HOST+
                "/reset-password?"+
                queryString.stringify({username: username, email: email, token: token})
            ) 
        );
    }
}

module.exports = Mailer;