const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InsuranceNotificationSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        default: null
    },
    type: {
        type: String,   // motor, corporate
        default: null
    },
    regNo: {
        type: String,
        default: null
    },
    policyNo: {
        type: String,
        default: null
    },
    dueDate: {
        type: Date,
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
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('ins_notification', InsuranceNotificationSchema);
module.exports = mongoose.model('ins_notification');
