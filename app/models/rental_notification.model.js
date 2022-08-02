const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentalNotificationSchema = new mongoose.Schema({
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        default: null
    },
    type: {
        type: String,   // agreementExpire, increaseRent, paymentDue
        default: null
    },
    message: {
        type: String,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
    priority: {
        type: Number,
        default: 100
    },
    status: {
        type: Number,
        default: 0
    },
    isActive: {
		type: Boolean,
		default: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('rental_notification', RentalNotificationSchema);
module.exports = mongoose.model('rental_notification');
