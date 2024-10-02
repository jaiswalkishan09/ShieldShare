// require knex for database connection
var knex = require("knex");

const dbConnection = require("../common/connection");
const { DateTime } = require("luxon");

const {
  getUserDetailsBasedOnUserId,
  getAllUserWithoutAnyPendingRequest,
  insertIntoTable,
  getUserHistory,
  getPendingRequestToApporve,
  updateRequestTable,
} = require("../common/commonFunction");
const { tables } = require("../common/tableAlias");

const getUserDetails = async (req, res) => {
  let connectDb = await dbConnection.getDataBaseConnection();
  const databaseConnection = knex(connectDb.connection);
  try {
    let userId = req.userId;
    let userData = await getUserDetailsBasedOnUserId(
      databaseConnection,
      userId
    );

    if (userData.length > 0) {
      userData = userData[0];
    }
    databaseConnection ? databaseConnection.destroy() : null;
    return res.status(200).json({
      userName: userData.User_Name,
      firstName: userData.First_Name,
      lastName: userData.Last_Name,
      email: userData.Email,
      mobileNo: userData.Mobile_No,
    });
  } catch (e) {
    databaseConnection ? databaseConnection.destroy() : null;
    console.log("Error in getUserDetails main catch block", e);
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

const getAllUserDetails = async (req, res) => {
  try {
    let connectDb = await dbConnection.getDataBaseConnection();
    const databaseConnection = knex(connectDb.connection);
    try {
      let userId = req.userId;
      let userData = await getAllUserWithoutAnyPendingRequest(
        databaseConnection,
        userId
      );

      databaseConnection ? databaseConnection.destroy() : null;
      return res.status(200).json({
        userData: userData,
      });
    } catch (e) {
      databaseConnection ? databaseConnection.destroy() : null;
      console.log("Error in getUserDetails main catch block", e);
      return res
        .status(500)
        .json({ message: "Something went wrong please try again." });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

const addRequest = async (req, res) => {
  const { requestedTo } = req.body;
  let userId = req.userId;
  let connectDb = await dbConnection.getDataBaseConnection();
  const databaseConnection = knex(connectDb.connection);

  try {
    const data = {
      Requested_By: userId,
      Requested_To: requestedTo,
      Requested_Date: DateTime.utc().toISO(),
      Request_Status: "PENDING",
    };
    await insertIntoTable(databaseConnection, data, tables.userRequest);
    return res.status(201).json({ requestedTo });
  } catch (e) {
    databaseConnection ? databaseConnection.destroy() : null;
    console.log("Error in addRequest main catch block", e);
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

const getAllUserHistory = async (req, res) => {
  try {
    let connectDb = await dbConnection.getDataBaseConnection();
    const databaseConnection = knex(connectDb.connection);
    try {
      let userId = req.userId;
      let userData = await getUserHistory(databaseConnection, userId);

      databaseConnection ? databaseConnection.destroy() : null;
      return res.status(200).json({
        requestData: userData,
      });
    } catch (e) {
      databaseConnection ? databaseConnection.destroy() : null;
      console.log("Error in getAllUserHistory main catch block", e);
      return res
        .status(500)
        .json({ message: "Something went wrong please try again." });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

const getApprovalPendingRequest = async (req, res) => {
  try {
    let connectDb = await dbConnection.getDataBaseConnection();
    const databaseConnection = knex(connectDb.connection);
    try {
      let userId = req.userId;
      let userData = await getPendingRequestToApporve(
        databaseConnection,
        userId
      );

      databaseConnection ? databaseConnection.destroy() : null;
      return res.status(200).json({
        requestData: userData,
      });
    } catch (e) {
      databaseConnection ? databaseConnection.destroy() : null;
      console.log("Error in getApprovalPendingRequest main catch block", e);
      return res
        .status(500)
        .json({ message: "Something went wrong please try again." });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

const updateRequest = async (req, res) => {
  const { requestId, status, firstName, lastName, email, mobileNo } = req.body;

  let connectDb = await dbConnection.getDataBaseConnection();
  const databaseConnection = knex(connectDb.connection);

  try {
    let data = "";
    if (status === "REJECTED") {
      data = {
        Request_Updated_On: DateTime.utc().toISO(),
        Request_Status: "REJECTED",
      };
    } else if (status === "APPROVED") {
      data = {
        Request_Updated_On: DateTime.utc().toISO(),
        Request_Status: "APPROVED",
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Mobile_No: mobileNo,
      };
    } else {
      return res.status(400).json({ message: "Invalid input" });
    }
    console.log(data);
    await updateRequestTable(
      databaseConnection,
      data,
      tables.userRequest,
      requestId
    );
    return res.status(201).json({ message: "Request updated successfully." });
  } catch (e) {
    databaseConnection ? databaseConnection.destroy() : null;
    console.log("Error in updateRequest main catch block", e);
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

module.exports = {
  getUserDetails,
  getAllUserDetails,
  addRequest,
  getAllUserHistory,
  getApprovalPendingRequest,
  updateRequest,
};
