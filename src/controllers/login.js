const Super = require("../models/Super.js");
const Admin = require("../models/Admin.js");
const User = require("../models/User.js");
const {
	InternalServerError,
	AuthorizationError,
} = require("../utils/errors.js");
const jwt = require("../utils/jwt.js");
const { mockUser, mockSuper } = require("../../mock.js");

class Login {
	async userLogin(req, res, next) {
		try {
			const { loginName, loginPassword } = req.body;

			const user =
				(await User.findOne({ loginName })) ||
				(await Super.findOne({ loginName })) || (await Admin.findOne({ loginName }));
			if (!user || user.loginPassword !== loginPassword) {
				return next(new AuthorizationError(401, "Invalid login credentials!"));
			}

			const token = jwt.sign({
				userId: user._id,
				agent: req.headers["user-agent"],
				role: user.role,
			});

			return res
				.status(200)
				.json({data: user, message: "Here is your token", token });
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
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
			await Super.insertMany(mockSuper);
			res.status(200).json("Admins inserted");
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
}

module.exports = new Login();
