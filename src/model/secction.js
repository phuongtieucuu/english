const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Section";
const COLLECTION_NAME = "Sections";

const sectionSchema = new Schema(
  {
    sec_name:  { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, sectionSchema);
