const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");

const router = Router();
const myidRouter = require("./myid.js");
const loginRouter = require("./login.js");
const userRouter = require("./user.js");
const superRouter = require("./super.js");
const extraRouter = require("./extra.js");
const swaggerDoc = require("../docs/swagger.js");
const pdfRouter = require("./createPDF.js");
const uploadRouter = require("./uploadImage.js");
const appRouter = require("./app.js");
const merchantRouter = require("./merchant.js");
const fillialRouter = require("./fillial.js");

router.use("/api/login", loginRouter);
router.use("/api/myid", myidRouter);
router.use("/api/user", userRouter);
router.use("/api/super", superRouter);
router.use("/api", extraRouter);
router.use("/create-pdf", pdfRouter);
router.use("/upload-image", uploadRouter);
router.use("/app", appRouter);
router.use("/api/merchant", merchantRouter);
router.use("/api/fillial", fillialRouter);

router.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
