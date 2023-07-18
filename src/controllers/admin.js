const jwt = require("../utils/jwt.js");
const Super = require("../models/Super.js");
const Admin = require("../models/Admin.js");
const cryptoRandomString = require("secure-random-string");
const {
	InternalServerError,
	ForbiddenError,
	BadRequestError,
	NotFoundError,
	AuthorizationError,
} = require("../utils/errors.js");

class Admins {
	async adminLogin(req, res, next) {
		try {
			const { loginName, loginPassword } = req.body;

			const admin =
				(await Admin.findOne({ loginName })) ||
				(await Super.findOne({ loginName }));
			if (!admin || admin.loginPassword !== loginPassword) {
				return next(new AuthorizationError(401, "Invalid login credentials!"));
			}

			const token = jwt.sign({
				userId: admin._id,
				agent: req.headers["user-agent"],
				role: admin.role,
			});

			return res.status(200).json({
				data: {
					fullName: admin.fullName,
					imageUrl: admin.imageUrl,
					role: admin.role,
				},
				message: "Here is your token",
				token,
			});
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
	async getAllAdmin(req, res, next) {
		try {
			if (req.user.role !== "super_admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			const admins = await Admin.find();
			return res.status(200).send(admins);
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
	async getAdmin(req, res, next) {
		try {
			if (req.user.role !== "super_admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			const user = await Admin.findById(req.params.id);
			return res.status(200).send(user);
		} catch (error) {
			return next(new InternalServerError(500, error.message));
		}
	}
	async createAdmin(req, res, next) {
		try {
			if (req.user.role !== "super_admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			let imageUrl = req.file.filename;
			const { fullName, phoneNumber, email } = req.body;

			// Generate random login name and password
			const loginName = cryptoRandomString({ length: 10 });
			const loginPassword = cryptoRandomString({ length: 15 });

			const existingAdmin = await Admin.exists({ phoneNumber });
			if (existingAdmin) {
				return next(
					new BadRequestError(
						400,
						"A super with the given phone number already exists"
					)
				);
			}

			await Admin.create({
				loginName,
				loginPassword,
				imageUrl,
				fullName,
				phoneNumber,
				email,
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
	async updateAdmin(req, res, next) {
		try {
			if (req.user.role !== "super_admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}
			const { fullName, phoneNumber, email } = req.body;
			let image = req.file ? req.file.filename : null; // use null if no file was uploaded

			const user = await Admin.findById(req.params.id);
			if (!user) {
				return next(new NotFoundError(404, "Admin not found"));
			}

			user.imageUrl = image ? image : user.imageUrl;
			user.fullName = fullName || user.fullName;
			user.phoneNumber = phoneNumber || user.phoneNumber;
			user.email = email || user.email;

			await user.save();

			return res
				.status(200)
				.send({
					message: "Successfully updated",
					data: { adminID: req.params.id },
				});
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
	async deleteAdmin(req, res, next) {
		try {
			if (req.user.role !== "super_admin") {
				return next(
					new ForbiddenError(
						403,
						"You do not have permission to access this resource"
					)
				);
			}

			const user = await Admin.findById(req.params.id);
			if (!user) {
				return next(new NotFoundError(404, "Admin not found!"));
			}

			await Admin.deleteOne({ _id: req.params.id });

			return res.status(200).send({ message: "Admin deleted" });
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

module.exports = new Admins();
