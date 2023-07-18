const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
	{
		loginName: {
			type: String,
			required: true,
		},
		loginPassword: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
		},
		fullName: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
			match: /^\+998([378]{2}|(9[013-57-9]))\d{7}$/,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		role: {
			type: String,
			default: "admin"
		}
	},
	{ timestamps: true }
);

adminSchema.index({ phoneNumber: 1 });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;