const express = require("express");
const mailRoute = express.Router();
const authMiddlewars = require("../../middlewars/auth/authMiddlewars");
const {
  sendEmailMsgCtrl,
} = require("../../controllers/emailMassegeCtrl/emailMassegeCtrl");

mailRoute.post("/", authMiddlewars, sendEmailMsgCtrl);

module.exports = mailRoute;
