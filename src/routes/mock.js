const { Router } = require("express");
const mockController = require("../controllers/mock.js");

const router = Router();

router.post("/mockUser", mockController.addMockUser);
router.post("/mockAdmin", mockController.addMockAdmin);
router.post("/mockSuper", mockController.addMockSuper);

module.exports = router;