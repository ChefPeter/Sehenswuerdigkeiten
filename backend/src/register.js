async function register(params) {
    // Schauen ob alle Pflichtfelder ausgefüllt sind
    if (!checkMandatoryField(params)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Schauen, ob Email im gültigen Format ist
    if (!/.+@.+/.test(params.email)) return "Geben Sie eine gültige Email ein!";

    // Schauen, ob das Passwort sicher genug ist
    if (!securePassword(params.password)) return "Das Passwort ist nicht sicher genug!";

    // Schauen, ob die Passwörter übereinstimmen
    if (params["password"] !== params["repeat-password"]) return "Die Passwörter stimmen nicht überein!";

    // Schauen, ob Benutzername schon vergeben ist
    if (await(!checkAvailableUsername(params.username))) return "Der Benutzername ist schon vergeben!";

    // Schauen, ob Email schon vergeben ist
    if (await(!checkAvailableEmail(params.email))) return "Die Email-Adresse ist schon vergeben!";
}

function checkMandatoryField(params) {
    const fields = [
        "username",
        "email",
        "password",
        "repeat-password"
    ];
    return fields.every(field => params[field]);
}

function securePassword(password) {
    return password.test(/[a-zA-Z]/g) && password.test(/\d/g) && password.length >= 8;
}

async function checkAvailableUsername(username) {

}

async function checkAvailableEmail(email) {

}

module.exports = register;