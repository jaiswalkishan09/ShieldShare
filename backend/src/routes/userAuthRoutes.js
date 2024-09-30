const express = require("express");
const userAuthRouter = express.Router();

const { getUserDetails } = require("../controllers/authRouteControllers");
const auth = require("../middlewares/auth");

userAuthRouter.get("/getuserDetails", auth, getUserDetails);

module.exports = userAuthRouter;
