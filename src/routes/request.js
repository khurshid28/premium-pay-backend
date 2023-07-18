const { Router } = require("express");
const upload = require("../utils/upload.js");
const userController = require("../controllers/user.js");
const checkToken = require("../middlewares/check-token.js");

const router = Router();

router.use(checkToken);
router.get("/all", userController.getAllRequests);
router.get("/get/:id", userController.getRequest);
router.post("/create", upload.single("imageUrl"), userController.createRequest);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
