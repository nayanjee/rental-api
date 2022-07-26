const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoownerSchema = new mongoose.Schema({
  lessorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Lessor",
		default: null
	},
  name: {
    type: String,
    default: null
  },
  percentage: {
    type: String,
    default: 100
  },
  glCode: {
    type: Number,
    default: null
  },
  ifsc: {
    type: String,
    default: null
  },
  accountNo: {
    type: Number,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  altPhone: {
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

mongoose.model('Coowner', CoownerSchema);
module.exports = mongoose.model('Coowner');
