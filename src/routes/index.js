const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");

const router = Router();

const userRouter = require("./user.js");
const superRouter = require("./super.js");
const adminRouter = require("./admin.js");
const extraRouter = require("./extra.js");
const mockRouter = require("./mock.js");
// const requestRouter = require("./request.js");
const swaggerDoc = require("../docs/swagger.js");

router.use("/user", userRouter);
router.use("/super", superRouter);
router.use("/admin", adminRouter);
router.use("/", extraRouter);
router.use("/mock", mockRouter);
// router.use("/request", requestRouter);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
