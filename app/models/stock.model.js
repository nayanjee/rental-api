const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new mongoose.Schema({
    plantCode: {
        type: String,
        default: null
    },
    divSAPcode: {
        type: String,
        default: null
    },
    division: {
        type: String,
        default: null
    },
    materialCode: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    salesQty: {
        type: Number,
        default: 0
    },
    batch: {
        type: String,
        default: null
    },
    expireOn: {
        type: Date,
        default: null
    },
    value: {
        type: Number,
        default: 0
    },
    transitStock: {
        type: Number,
        default: 0
    },
    transitValue: {
        type: Number,
        default: 0
    },
    month: {
        type: String,
        default: null
    },
    year: {
        type: String,
        default: null
    },
    monthYear: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: "629f2b920be81137cfedb9b6"
    }
}, {
    timestamps: true
});

mongoose.model('stocks', StockSchema);
module.exports = mongoose.model('stocks');
