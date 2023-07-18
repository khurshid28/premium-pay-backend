const mongoose = require("mongoose");

const user_identification = new mongoose.Schema({
	passport_info: {
		type: String,
		required: true,
	},
	birthDate: {
		type: Date,
		required: true,
	},
});

const user_data = new mongoose.Schema({
	phoneNumber: {
		type: String,
		required: true,
		match: /^\+998([378]{2}|(9[013-57-9]))\d{7}$/,
	},
	additionalNumber: {
		type: String,
		required: true,
		match: /^\+998([378]{2}|(9[013-57-9]))\d{7}$/,
	},
	address: {
		type: {
			region: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			homeAddress: {
				type: String,
				required: true,
			},
		},
		required: true,
	},
	pc_number: {
		type: String,
		required: true,
	},
	pc_limit: {
		type: String,
		required: true,
	},
});

const calculation = new mongoose.Schema({});

const requestSchema = new mongoose.Schema(
	{
		user_identification,
		user_data,
		status: {
			type: String,
			enum: ["Progress", "Accepted", "Canceled"],
			default: "Progress",
		},
		cancel_reason: {
			type: String,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
