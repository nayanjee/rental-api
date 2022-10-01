const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UploadSchema = new mongoose.Schema({
    category: {
        type: String,
        default: null
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    type: {
        type: String,
        default: null
    },
    name: {
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
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('ins_upload', UploadSchema);
module.exports = mongoose.model('ins_upload');
