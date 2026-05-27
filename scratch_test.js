const Fuse = require("fuse.js");

const questions = [
  { _id: "1", body: "Hi, how to add images ??" },
  { _id: "2", body: "Hi" }
];

const fuse = new Fuse(questions, {
  keys: ["body"],
  threshold: 0.45,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  distance: 200,
});

const query = "images";
const hits = fuse.search(query);

console.log("Hits for 'images':", hits);

const query2 = "images ";
const hits2 = fuse.search(query2);
console.log("Hits for 'images ':", hits2);
