const { Router } = require("express");
const fillialController = require("../controllers/2.fillial.js");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();

router.use(checkToken);
router.use(checkBlocked);
router.post("/create", fillialController.create);
router.get("/:id", fillialController.getbyId);
router.get("/getAll", fillialController.getAll);


module.exports = router;