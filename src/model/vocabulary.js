const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Vocabulary";
const COLLECTION_NAME = "Vocabularys";

const vocabularySchema = new Schema(
  {
    voc_name:  { type: String, default: "" },
    voc_mean:  { type: String, default: "" },
    voc_api:  { type: String, default: "" },
    voc_sec: {
        type: Schema.Types.ObjectId,
        ref: "Section",
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, vocabularySchema);
