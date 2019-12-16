const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
  },
  //note is from the user not from the article
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Site = mongoose.model("Site", SiteSchema);

module.exports = Site;