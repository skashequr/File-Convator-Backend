const mongoose = require("mongoose");

const searchDataSchema = new mongoose.Schema({
  search: {
    type: String,
    required: true,
  },
});

const SearchData = mongoose.model("SearchData", searchDataSchema);

module.exports = SearchData;
