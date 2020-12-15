const router = require("express").Router();
const fetch = require("node-fetch");
const Word = require("../models/word.model");
const { DICT_DEFINITION, DICT_SEARCH } = require("./paths");

const RAPID_API_BASE_URL = "https://wordsapiv1.p.rapidapi.com/";

router.route(DICT_SEARCH.path).post(async function (req, res, next) {
  const { word } = req.body;

  if (!word) {
    // TODO: decide whether return success or error for empty query case
    res.status(200).send([]);
  }

  // TODO: write a HttpUtil class for handling these requests
  // TODO: check if URI convertion is required for emtpy spaces etc.
  const data = await fetch(
    `${RAPID_API_BASE_URL}/words/?letterPattern=^${word}.*$&limit=10`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      // TODO: should i throw error here?
    });

  if (data && data.results) {
    res.status(200).send(data.results);
  } else {
    // TODO: add an error message
    res.status(400).send();
  }
});

router.route(DICT_DEFINITION.path).post(async function (req, res, next) {
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

  const data = await fetch(`${RAPID_API_BASE_URL}/words/${word}/definitions`, {
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
    // Note: words api returns the closest match if the exact match is not found so that
    // it is needed to be careful about this feature. Right now, app is planned to search
    // the existing words and get the definitions afterwards. But, if somehow this process
    // is bypassed, there will be duplicates in the DB.
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
