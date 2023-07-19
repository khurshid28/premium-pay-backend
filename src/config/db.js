const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("Database connected");
	} catch (err) {
		console.error(`Database error: ${err}`);
		process.exit(1);
	}
};

connectDB();