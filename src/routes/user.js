const { Router } = require("express");
const upload = require("../utils/upload.js");
const userController = require("../controllers/user.js");
const checkAdmin = require("../middlewares/check-token.js");

const router = Router();

router.post("/login", userController.userLogin);
router.get("/all", checkAdmin, userController.getAllUsers);
router.get("/get/:id", checkAdmin, userController.getUser);
router.post("/create", checkAdmin, upload.single("imageUrl"), userController.createUser);
router.put("/update/:id", checkAdmin, upload.single("imageUrl"), userController.updateUser);
router.delete("/delete/:id", checkAdmin, userController.deleteUser);

module.exports = router;

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   - name: User
 *     description: Operations for managing User endpoints
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginName:
 *                 type: string
 *                 maxLength: 10
 *                 example: "R5n2QzjKw9"
 *               loginPassword:
 *                 type: string
 *                 maxLength: 15
 *                 example: "X8p4Mq3Ls6tG7wZ"
 *             required:
 *               - loginName
 *               - loginPassword
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The user object
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Here is your token bro
 *                 token:
 *                   type: string
 *                   description: The JSON Web Token (JWT) for the user session
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTRmMWQ2Y2I5ZTE3YTMyZjEyYzM0NzciLCJhZ2VudCI6IjEiLCJyb2xlIjoidXNlciIsImlhdCI6MTYzNDYyMzYyMywiZXhwIjoxNjM0NjI3MjIzfQ.Tv6l-GhqfU_5mEjfyxB9_ZPZrAmCxW60ZsiRg1jK7zI
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Invalid login credentials!
 *       '500':
 *         description: The error from backend
 * /user/all:
 *   get:
 *     tags:
 *       - User
 *     summary: Endpoint to get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /user/get/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /user/create:
 *   post:
 *     tags:
 *       - User
 *     summary: Create new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^\+998([378]{2}|(9[013-57-9]))\d{7}$'
 *               email:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               gender:
 *                  type: string
 *                  enum: ["Мужской", "Женский"]
 *               address:
 *                 type: object
 *                 properties:
 *                   region:
 *                     type: string
 *                     required: true
 *                   city:
 *                     type: string
 *                     required: true
 *                   homeAddress:
 *                     type: string
 *                     required: true
 *               description:
 *                 type: string
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - birthDate
 *               - gender
 *               - address
 *               - description
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loginName:
 *                   type: string
 *                   maxLength: 10
 *                   example: "R5n2QzjKw9"
 *                 loginPassword:
 *                   type: string
 *                   maxLength: 15
 *                   example: "X8p4Mq3Ls6tG7wZ"
 *       400:
 *         description: A user with the given phone number already exists
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device or You do not have permission to access this resource
 *       500:
 *         description: The error from backend
 * /user/update/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^\+998([378]{2}|(9[013-57-9]))\d{7}$'
 *               email:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               gender:
 *                  type: string
 *                  enum: ["Мужской", "Женский"]
 *               address:
 *                 type: object
 *                 properties:
 *                   region:
 *                     type: string
 *                     required: true
 *                   city:
 *                     type: string
 *                     required: true
 *                   homeAddress:
 *                     type: string
 *                     required: true
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /user/delete/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of user to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 */

/**
 * @swagger
 *   components:
 *     schemas:
 *       User:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             format: objectid
 *             readOnly: true
 *           loginName:
 *             type: string
 *           loginPassword:
 *             type: string
 *           imageUrl:
 *             type: string
 *           fullName:
 *             type: string
 *           phoneNumber:
 *             type: string
 *             pattern: '^\+998([378]{2}|(9[013-57-9]))\d{7}$'
 *           email:
 *             type: string
 *           birthDate:
 *             type: string
 *             format: date-time
 *           gender:
 *             type: string
 *             enum: ["Мужской", "Женский"]
 *           address:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 required: true
 *               city:
 *                 type: string
 *                 required: true
 *               homeAddress:
 *                 type: string
 *                 required: true
 *           description:
 *             type: string
 *         required:
 *           - fullName
 *           - phoneNumber
 *           - email
 *           - birthDate
 *           - gender
 *           - address
 *           - description
 */
