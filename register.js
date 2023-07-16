const prompt = require("prompt-sync")();
const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const fetch = require("node-fetch");

//entering register url
console.log("Enter register url");
const registerURL = prompt();
console.log("Enter access token");
const accessToken = prompt();

fs.createReadStream('./export.csv').pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', async () => {

        results.forEach(async (elm) => {
            const request = {
                "name": elm.name,
                "user_ID": elm.user_ID,
                "password": elm.password,
                "role": parseInt(elm.role, 10)
            };
            console.log(request)
            const bearer = accessToken;

            const res =  await fetch(registerURL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${bearer}`
                    },
                    body: JSON.stringify(request)
                }
            )

            const data = await res.json();

            console.log(data);

        })
    });





