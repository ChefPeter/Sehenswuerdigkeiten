require("dotenv").config();
const fs = require('fs');
const SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SEND_IN_BLUE_API_KEY;

class Mailer {

    sendEmail(recipient, recipientName, subject, sender, senderName, content) {
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
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
        });
    }

    sendRegisterEmail(username, email, token) {
        this.sendEmail(
            email,
            username,
            "Willkommen bei City2Go",
            "no-reply@city2go.com",
            "City2Go",
            fs.readFileSync("../email/registerEmail.html", 'utf-8')
        );
    }

    sendResetPasswordEmail(username, email, token) {
        this.sendEmail(
            email,
            username,
            "Passwort zurücksetzen",
            "no-reply@city2go.com",
            "City2Go",
            fs.readFileSync("../email/resetEmail.html", 'utf-8')
        );
    }
}

module.exports = Mailer;