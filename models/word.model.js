const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WordDefinitionSchema = new Schema({
  definition: {
    type: String,
    required: true,
  },
  partOfSpeech: {
    type: String,
    required: true,
  },
});

const WordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
    definitions: [WordDefinitionSchema],
  },
  {
    timestamps: true,
  }
);

const Word = mongoose.model("Word", WordSchema);

module.exports = Word;
