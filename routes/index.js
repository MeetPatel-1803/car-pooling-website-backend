const { Router } = require("express");
const apiRoutes = require("./v1");

const router = Router();

// Routes are defined below for API version v1.
router.use("/api", apiRoutes);

module.exports = router;
