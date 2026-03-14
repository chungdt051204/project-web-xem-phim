const express = require("express");
const router = express.Router();
const viewLogController = require("./viewLog.controller");
const prefix = "";
router.get(`${prefix}/view_log`, viewLogController.getViewLog);
module.exports = router;
