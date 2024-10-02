const express = require("express");
const userAuthRouter = express.Router();

const {
  getUserDetails,
  getAllUserDetails,
  addRequest,
  getAllUserHistory,
} = require("../controllers/authRouteControllers");
const auth = require("../middlewares/auth");

userAuthRouter.get("/getuserDetails", auth, getUserDetails);
userAuthRouter.get("/allUsers", auth, getAllUserDetails);
userAuthRouter.post("/addRequest", auth, addRequest);
userAuthRouter.get("/history", auth, getAllUserHistory);

module.exports = userAuthRouter;
