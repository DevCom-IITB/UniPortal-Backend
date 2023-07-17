const prompt = require("prompt-sync")();
const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const fetch = require("node-fetch"); //in case you are using a newer version of node 20.0 and above comment out this line

//entering register url
console.log("Enter register url");
const registerURL = prompt();
console.log("Enter access token");
const accessToken = prompt();

fs.createReadStream('./export.csv').pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => {

        results.forEach((elm) => {
            const request = {
                "name": elm.name,
                "user_ID": elm.user_ID,
                "password": elm.password,
                "role": parseInt(elm.role, 10)
            };
            console.log(request)
            const bearer = accessToken;

            fetch(registerURL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearer}`
                    },
                    body: JSON.stringify(request)
                }
            ).then((data) => {
                console.log(data.json())
            })

        })
    });





