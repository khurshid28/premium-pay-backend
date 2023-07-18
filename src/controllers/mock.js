const User = require("../models/User.js");
const Super = require("../models/Super.js");
const Admin = require("../models/Admin.js");
const { mockUser, mockSuper, mockAdmin } = require("../../mock.js");
const { InternalServerError } = require("../utils/errors.js");

class Mock {
	async addMockUser(req, res, next) {
		try {
			await User.insertMany(mockUser);
			res.status(200).json("User inserted");
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
	async addMockAdmin(req, res, next) {
		try {
			await Admin.insertMany(mockAdmin);
			res.status(200).json("Admins inserted");
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
	async addMockSuper(req, res, next) {
		try {
			await Super.insertMany(mockSuper);
			res.status(200).json("Supers inserted");
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
}

module.exports = new Mock();
