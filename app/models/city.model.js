const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitySchema = new mongoose.Schema({
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State"
  },
  name: {
    type: String,
    default: null
  },
  isActive: {
  	type: Boolean,
  	default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
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

mongoose.model('City', CitySchema);
module.exports = mongoose.model('City');
