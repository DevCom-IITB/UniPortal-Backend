const prompt = require("prompt-sync")();
const axios = require("axios");
const csv = require("csv-parser");
const fs = require("fs");
const results = [];



//entering register url
console.log("Enter register url");
const registerURL = prompt();
console.log("Enter access token");
const accessToken = prompt();

const authAxios = axios.create({
    baseURL: registerURL,
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})



fs.createReadStream('./export.csv').pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => {

        results.forEach((elm) => {
            authAxios.post("/user/register", {
                name: elm.name,
                user_ID: elm.user_ID,
                password: elm.password,
                role: parseInt(elm.role, 10)
            })
                .then(() => {
                });
        })

    });





