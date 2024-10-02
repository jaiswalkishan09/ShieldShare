const express = require("express");
const userAuthRouter = express.Router();

const {
  getUserDetails,
  getAllUserDetails,
  addRequest,
  getAllUserHistory,
  getApprovalPendingRequest,
  updateRequest,
  getApprovalHistoryRequest,
} = require("../controllers/authRouteControllers");
const auth = require("../middlewares/auth");

userAuthRouter.get("/getuserDetails", auth, getUserDetails);
userAuthRouter.get("/allUsers", auth, getAllUserDetails);
userAuthRouter.post("/addRequest", auth, addRequest);
userAuthRouter.get("/history", auth, getAllUserHistory);
userAuthRouter.get("/approvalPending", auth, getApprovalPendingRequest);
userAuthRouter.get("/approvalHistory", auth, getApprovalHistoryRequest);
userAuthRouter.put("/updateRequest", auth, updateRequest);

module.exports = userAuthRouter;
