const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: process.env.ELASTIC_URI,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const searchDoc = asyncHandler(async (req, res) => {
  const a = req.body.search;
  await client
    .search({
      index: "infoques",
      query: {
        bool: {
          should: [
            {
              match: {
                doc_title: {
                  query: a, //query string goes here
                },
              },
            },
            {
              fuzzy: {
                doc_title: {
                  value: a,
                  fuzziness: 2,
                },
              },
            },
          ],
        },
      },
    })
    .then((data) => {
      data.hits.hits.forEach((element) => console.log(element));
      res.json(data);
    })
    .catch((err) => console.log(err));
});

const indexDoc = async (body, id) => {
  await client
    .index({
      index: "infoques",
      id: id, // setting a custom id which is equal to that of the equivalent question
      body: {
        doc_title: body, //title
      },
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("success");
};

const deleteDoc = async (id) => {
  await client.delete({
    index: "infoques",
    id: id,
  });
};

module.exports = { indexDoc, searchDoc, deleteDoc };
