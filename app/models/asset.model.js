const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssetSchema = new mongoose.Schema({
  propertyType: {
    type: String,
    default: 'residential'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lessor",
    default: null
  },
  allotee: {
    type: String,
    default: null
  },
  flatNo: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State"
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  },
  zipCode: {
    type: Number,
    default: null
  },
  area: {
    type: String,
    default: null
  },
  agreementPeriod: {
    type: String,
    default: null
  },
  agreementType: {
    type: String,
    default: null
  },
  leaseCommencementDate: {
    type: Date,
    default: null
  },
  rentCommencementDate: {
    type: Date,
    default: null
  },
  agreementExpiryDate: {
    type: Date,
    default: null
  },
  LockInPeriod: {
    type: String,
    default: null
  },
  rentEscalationDate: {
    type: String,
    default: null
  },
  rentAmount: {
    type: Number,
    default: null
  },
  increaseRentPercent: {
    type: Number,
    default: null
  },
  increaseRentPeriod: {
    type: Number,
    default: null
  },
  securityDepositAmount: {
    type: Number,
    default: null
  },
  securityDepositDescription: {
    type: String,
    default: null
  },
  remarks: {
    type: String,
    default: null
  },
  paymentDueDate: {
    type: Number,
    default: null
  },
  paymentPattern: {
    type: String,
    default: null
  },
  previousRecord: {
    type: String,
    default: null
  },
  isOccupied: {
    type: Boolean,
    default: true
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

mongoose.model('Asset', AssetSchema);
module.exports = mongoose.model('Asset');
