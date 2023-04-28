const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset"
  },
  filename: {
    type: String,
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  }
}, {
  timestamps: true
});

mongoose.model('rental_file', FileSchema);
module.exports = mongoose.model('rental_file');
