const assert = require("assert");
const fetch = require("cross-fetch");
const FormData = require("form-data");
const https = require("https");
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

describe("Backend test cases with mocha chai assertion library", function() {
    it("Check if server is available", async function() {
        const res = await fetch("https://10.10.30.18:8443/debug", {
            method: "GET",
            agent: httpsAgent
        });
        const status = res.status;
        assert.equal(status, 200, "Der Server ist nicht erreichbar!");
    });
    it("Check if login protection works", async function() {
        const res = await fetch("https://10.10.30.18:8443/", {
            method: "GET",
            agent: httpsAgent
        });
        const status = res.status;
        assert.equal(status, 401, "Der Loginschutz funktioniert nicht!");
    });
    it("Check if login works", async function() {
        const formData = new FormData();
        formData.append("username", "zLuki");
        formData.append("password", "Kennwort0");
        const res = await fetch("https://10.10.30.18:8443/login", {
            method: "POST",
            credentials: "include",
            body: formData,
            agent: httpsAgent
        });
        const status = res.status;
        assert.equal(status, 200, "Der Login funktioniert nicht: " + (await res.text()));
    });
});