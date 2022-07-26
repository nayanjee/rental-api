const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StateSchema = new mongoose.Schema({
    code: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    gstCode: {
        type: Number,
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

mongoose.model('State', StateSchema);
module.exports = mongoose.model('State');
