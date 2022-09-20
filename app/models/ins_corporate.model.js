const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InsCorporateSchema = new mongoose.Schema({
    product: {
        type: String,
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
    sumInsured: {
        type: Number,
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
    remarks: {
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
    isCurrent: {
        type: Boolean,
        default: true
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

mongoose.model('ins_corporate', InsCorporateSchema);
module.exports = mongoose.model('ins_corporate');
