const asyncHandler = require("express-async-handler");
const Fuse = require("fuse.js");
const questionModel = require("../models/questionModel");
const infopostModel = require("../models/infopostModel");

const filterVisibleContent = (question) => {
  const doc = question.toObject ? question.toObject() : { ...question };

  doc.comments = (doc.comments || []).filter((c) => !c.hidden);
  doc.answers = (doc.answers || [])
    .filter((a) => !a.hidden)
    .map((answer) => ({
      ...answer,
      comments: (answer.comments || []).filter((c) => !c.hidden),
    }));

  return doc;
};

const searchQuestions = asyncHandler(async (req, res) => {
  const query = (req.query.q || req.query.query || "").trim();

  if (!query || query.length < 2) {
    return res.json({ results: [] });
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 8, 20);

  const questionsPromise = questionModel
    .find({ hidden: false })
    .select("body user_Name user_ID asked_At upvotes answers comments _id")
    .sort({ asked_At: -1 })
    .lean();

  const infopostsPromise = infopostModel
    .find({ hidden: false })
    .select("title body asked_At _id")
    .sort({ asked_At: -1 })
    .lean();

  const [questionsData, infopostsData] = await Promise.all([
    questionsPromise,
    infopostsPromise,
  ]);

  const questions = questionsData.map((q) => ({ ...q, type: "question" }));
  const infoposts = infopostsData.map((i) => ({ ...i, type: "infopost" }));

  const allDocs = [...questions, ...infoposts];

  const fuse = new Fuse(allDocs, {
    keys: ["body"],
    threshold: 0.45,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    distance: 200,
  });

  const hits = fuse.search(query, { limit });

  const results = hits
    .map((hit) => ({
      _id: hit.item._id,
      title: hit.item.title,
      body: hit.item.body,
      user_Name: hit.item.type === "infopost" ? "SMPC" : hit.item.user_Name,
      asked_At: hit.item.asked_At,
      upvotes: hit.item.upvotes || 0,
      answered:
        hit.item.type === "infopost"
          ? false
          : (hit.item.answers || []).filter((a) => !a.hidden).length > 0,
      score: hit.score,
      type: hit.item.type,
    }))
    // Bubble answered questions to the top within same score tier
    .sort((a, b) => {
      const scoreDiff = (a.score || 0) - (b.score || 0);
      if (Math.abs(scoreDiff) > 0.05) return scoreDiff;
      return (b.answered ? 1 : 0) - (a.answered ? 1 : 0);
    });

  res.json({ results });
});

const getQuestionById = asyncHandler(async (req, res) => {
  const question = await questionModel.findById(req.params.qid);

  if (!question || question.hidden) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json(filterVisibleContent(question));
});

module.exports = { searchQuestions, getQuestionById };
