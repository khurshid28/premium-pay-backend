const { Router } = require("express");
const upload = require("../utils/upload.js");
const adminController = require("../controllers/admin.js");
const checkToken = require("../middlewares/check-token.js");

const router = Router();

router.post("/login", adminController.adminLogin);
router.get("/all", checkToken, adminController.getAllAdmin);
router.get("/get/:id", checkToken, adminController.getAdmin);
router.post("/create", checkToken, upload.single("imageUrl"), adminController.createAdmin);
router.put("/update/:id", checkToken, upload.single("imageUrl"), adminController.updateAdmin);
router.delete("/delete/:id", checkToken, adminController.deleteAdmin);

module.exports = router;

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Operations for managing Admin endpoints
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Login admins or super admins
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
 *                   description: The admin object
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Here is your token bro
 *                 token:
 *                   type: string
 *                   description: The JSON Web Token (JWT) for the admin session
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTRmMWQ2Y2I5ZTE3YTMyZjEyYzM0NzciLCJhZ2VudCI6IjEiLCJyb2xlIjoidXNlciIsImlhdCI6MTYzNDYyMzYyMywiZXhwIjoxNjM0NjI3MjIzfQ.Tv6l-GhqfU_5mEjfyxB9_ZPZrAmCxW60ZsiRg1jK7zI
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Invalid login credentials!
 *       '500':
 *         description: The error from backend
 * /admin/all:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Endpoint to get all admins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admins fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device or You do not have permission to access this resource
 *       500:
 *         description: The error from backend
 * /admin/get/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of admin to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: Admin fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /admin/create:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create new admin
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
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *     responses:
 *       201:
 *         description: Admin created successfully
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
 *         description: A admin with the given phone number already exists
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device or You do not have permission to access this resource
 *       500:
 *         description: The error from backend
 * /admin/update/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update admin by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to update
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
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /admin/delete/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete admin by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of admin to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: Admin deleted
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
 *       Admin:
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
 *         required:
 *           - fullName
 *           - phoneNumber
 *           - email
 */