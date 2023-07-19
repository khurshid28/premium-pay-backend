require("./src/config/index.js");
require("./src/config/db.js");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");

// all routes
const router = require("./src/routes/index.js");

// bult in middlewares
const logger = require("./src/middlewares/logger.js");
const rateLimit = require("./src/middlewares/rate-limit.js");
const errorHandler = require("./src/middlewares/error-handler.js");
// const authenticateToken = require('./src/middlewares/authMiddleware.js');

const app = express();

// testing server
app.get("/", (req, res) => res.send("premium pay"));

// PORT
const PORT = process.env.PORT || 8090;

// Custom token for formatted date
morgan.token("customDateTime", function () {
	const currentDate = new Date()
		.toISOString()
		.replace(/T/, " ")
		.replace(/\..+/, "");
	return currentDate;
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(rateLimit());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan middleware after other middlewares
app.use(morgan(":customDateTime :method :url :status :response-time ms"));

// auth for APIs
// app.use(authenticateToken);

// all routes
app.use("/api", router);

// error handling
app.use(errorHandler);
app.use(logger);

// starting server
app.listen(PORT, () => console.log(`server ready on port:${PORT}`));
