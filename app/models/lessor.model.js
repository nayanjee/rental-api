const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessorSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    percentage: {
        type: String,
        default: 100
    },
    propertyType: {
        type: String,
        default: 'residential'
    },
    glCode: {
        type: String,
        default: null
    },
    ifsc: {
        type: String,
        default: null
    },
    accountNo: {
        type: String,
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
    isPartner: {
		type: Boolean,
		default: false
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

mongoose.model('Lessor', LessorSchema);
module.exports = mongoose.model('Lessor');
