const router = require("express").Router();
const fetch = require("node-fetch");

const BASE_URL = "https://wordsapiv1.p.rapidapi.com/";

router.route("/search").post(async function (req, res, next) {
  const { word } = req.body;
  // TODO: add null check to word

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

  res.status(200).send(data);
});

module.exports = router;
