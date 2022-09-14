const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InsMotorSchema = new mongoose.Schema({
    make: {
        type: String,
        default: null
    },
    model: {
        type: String,
        default: null
    },
    manufactureAt: {
		type: Number,
        default: null
	},
    regNo: {
        type: String,
        default: null
    },
    chachisNo: {
        type: String,
        default: null
    },
    idv: {
        type: Number,
        default: null
    },
    proposer: {
        type: String,
        default: null
    },
    insurer: {
        type: String,
        default: null
    },
    policyNo: {
        type: String,
        default: null
    },
    premium: {
        type: Number,
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

mongoose.model('ins_motor', InsMotorSchema);
module.exports = mongoose.model('ins_motor');
