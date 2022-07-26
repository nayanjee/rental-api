const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentalPaymentSchema = new mongoose.Schema({
    financialYear: {
        type: String,
        default: null
    },
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        default: null
    },
    lessorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Lessor",
		default: null
	},
    year: {
        type: Number,
        default: null
    },
    month: {
        type: Number,
        default: null
    },
    chequeNo: {
        type: Number,
        default: null
    },
    amount: {
        type: Number,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: "629f2b920be81137cfedb9b6"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('rental_payment', RentalPaymentSchema);
module.exports = mongoose.model('rental_payment');
