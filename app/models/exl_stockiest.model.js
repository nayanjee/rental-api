const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExlStockiestSchema = new mongoose.Schema({
    plantCode: {
        type: String,
        default: null
    },
    sapCustId: {
        type: String,
        default: null
    },
    organization: {
        type: String,
        default: null
    },
    stateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default: null
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        default: null
    },
    status: {
        type: Number,
        default: 1
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
        default: "629f2b920be81137cfedb9b6"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: "629f2b920be81137cfedb9b6"
    }
}, {
    timestamps: true
});

mongoose.model('exl_stockiest', ExlStockiestSchema);
module.exports = mongoose.model('exl_stockiest');
