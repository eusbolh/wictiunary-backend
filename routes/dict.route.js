const router = require("express").Router();
const fetch = require("node-fetch");
const Word = require("../models/word.model");

const BASE_URL = "https://wordsapiv1.p.rapidapi.com/";

router.route("/search").post(async function (req, res, next) {
  const { word } = req.body;
  // TODO: add null check to word

  const wordsInDB = await Word.find({ word })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      // TODO: log error
    });

  if (wordsInDB && wordsInDB.length > 0) {
    // TODO: should i clean ids from objects??
    console.log("Word is found in DB");
    res.status(200).send(wordsInDB[0]);
    return;
  }

  const data = await fetch(`${BASE_URL}/words/${word}/definitions`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      // TODO: should i throw error here?
    });

  const wordToSave = new Word({
    word: data.word,
    definitions: data.definitions,
  });

  await wordToSave
    .save()
    .then(() => {
      // TODO: log success
    })
    .catch((err) => {
      // TODO: log error
    });

  res.status(200).send(data);
});

module.exports = router;
