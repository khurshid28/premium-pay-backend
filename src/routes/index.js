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

router.use("/api/user", userRouter);
router.use("/api/super", superRouter);
router.use("/api/admin", adminRouter);
router.use("/api", extraRouter);
router.use("/api/mock", mockRouter);
// router.use("/api/request", requestRouter);

router.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
