const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	failOnErrors: true,
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Premium Pay API Docs",
			version: "1.0.0",
			description: "Documentation for Premium Pay Mobile App",
		},
		servers: [
			{
				url: `http://localhost:8090/api/`,
				description: "Local server"
			},
			{
				url: `http://ec2-3-87-205-224.compute-1.amazonaws.com/api/`,
				description: "Production server"
			}
		],
		schemes: ["http", "https"],
	},
	apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
