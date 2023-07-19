const jwt = require("../utils/jwt.js");
const User = require("../models/User.js");
const cryptoRandomString = require("secure-random-string");
const { InternalServerError, ForbiddenError, AuthorizationError, BadRequestError } = require("../utils/errors.js");

class Users {
	async userLogin(req, res, next) {
		try {
			const { loginName, loginPassword } = req.body;

			const user = await User.findOne({ loginName })
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
				.json({ data: { fullName: user.fullName, imageUrl: user.imageUrl, role: user.role }, message: "Here is your token", token });
		} catch (error) {
			if (error.name === "ValidationError") {
				let errors = {};
		  
				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});
		  
				return res.status(400).send(errors);
			}
			return next(new InternalServerError(500, error.message));
		}
	}
	async getAllUsers(req, res, next) {
		try {
			if (req.user.role !== "super_admin" && req.user.role !== "admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			const users = await User.find({ role: "user" });
			return res.status(200).send(users);
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
	async getUser(req, res, next) {
		try {
			if (req.user.role !== "super_admin" && req.user.role !== "admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			const user = await User.findById(req.params.id);
			return res.status(200).send(user);
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
	async createUser(req, res, next) {
		try {
			if (req.user.role !== "super_admin" && req.user.role !== "admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			let imageUrl = req.file.filename;
			const {
				fullName,
				phoneNumber,
				email,
				birthDate,
				gender,
				address,
				description,
			} = req.body;

			// Generate random login name and password
			const loginName = cryptoRandomString({ length: 10 });
			const loginPassword = cryptoRandomString({ length: 15 });

			const existingUser = await User.exists({ phoneNumber });
			if (existingUser) {
				return next(
					new BadRequestError(
						400,
						"A super with the given phone number already exists"
					)
				);
			}

			await User.create({
				loginName,
				loginPassword,
				imageUrl,
				fullName,
				phoneNumber,
				email,
				birthDate,
				gender,
				address,
				description,
			});

			return res.status(201).json({ loginName, loginPassword });
		} catch (error) {
			if (error.name === "ValidationError") {
				let errors = {};
		  
				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});
		  
				return res.status(400).send(errors);
			}
			return next(new InternalServerError(500, error.message));
		}
	}
	async updateUser(req, res, next) {
		try {
			if (req.user.role !== "super_admin" && req.user.role !== "admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			const {
				fullName,
				phoneNumber,
				email,
				birthDate,
				gender,
				address,
				description,
			} = req.body;
			let image = req.file ? req.file.filename : null; // use null if no file was uploaded

			const user = await User.findById(req.params.id);
			if (!user) {
				return next(new NotFoundError(404, "User not found"));
			}

			user.imageUrl = image ? image : user.imageUrl;
			user.fullName = fullName || user.fullName;
			user.phoneNumber = phoneNumber || user.phoneNumber;
			user.email = email || user.email;
			user.birthDate = birthDate || user.birthDate;
			user.gender = gender || user.gender;
			user.address = address || user.address;
			user.description = description || user.description;

			await user.save();

			return res
				.status(200)
				.send({ message: "Successfully updated", data: { userID: req.params.id }});
		} catch (error) {
			if (error.name === "ValidationError") {
				let errors = {};
		  
				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});
		  
				return res.status(400).send(errors);
			}
			return next(new InternalServerError(500, error.message));
		}
	}
	async deleteUser(req, res, next) {
		try {
			if (req.user.role !== "super_admin" && req.user.role !== "admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}

			const user = await User.findById(req.params.id);
			if (!user) {
				return next(new NotFoundError(404, "User not found!"));
			}

			await User.deleteOne({ _id: req.params.id });

			return res.status(200).send({ message: "User deleted" });
		} catch (error) {
			if (error.name === "ValidationError") {
				let errors = {};
		  
				Object.keys(error.errors).forEach((key) => {
					errors[key] = error.errors[key].message;
				});
		  
				return res.status(400).send(errors);
			}
			return next(new InternalServerError(500, error.message));
		}
	}
}

module.exports = new Users();
