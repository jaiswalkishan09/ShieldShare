// require table alias
const { tables } = require("./tableAlias");

async function getUserDetailsBasedOnUname(databaseConnection, uName) {
  try {
    return databaseConnection(tables.userBasicDetails)
      .select("*")
      .where("User_Name", uName)
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log("Error in getUserDetailsBasedOnUname .catch block", e);
        throw e;
      });
  } catch (e) {
    console.log("Error in getUserDetailsBasedOnUname main catch block", e);
    return false;
  }
}

async function getUserDetailsBasedOnUserId(databaseConnection, userId) {
  try {
    return databaseConnection(tables.userBasicDetails)
      .select("*")
      .where("User_Id", userId)
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log("Error in getUserDetailsBasedOnUserId .catch block", e);
        throw e;
      });
  } catch (e) {
    console.log("Error in getUserDetailsBasedOnUserId main catch block", e);
    return false;
  }
}

async function getAllUserWithoutAnyPendingRequest(databaseConnection, userId) {
  try {
    return databaseConnection(tables.userBasicDetails)
      .select("User_Id as userId", "User_Name as userName")
      .whereNotIn("User_Id", function () {
        this.select("Requested_To")
          .from("user_request")
          .where("Requested_By", userId)
          .andWhere("Request_Status", "PENDING");
      })
      .where("User_Id", "!=", userId)
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(
          "Error in getAllUserWithoutAnyPendingRequest .catch block",
          e
        );
        throw e;
      });
  } catch (e) {
    console.log(
      "Error in getAllUserWithoutAnyPendingRequest main catch block",
      e
    );
    throw e;
  }
}
async function checkExistingUser(databaseConnection, uName) {
  try {
    const userData = await getUserDetailsBasedOnUname(
      databaseConnection,
      uName
    );
    if (userData.length > 0) {
      return "User exist";
    } else {
      return "User don't exist";
    }
  } catch (e) {
    console.log("Error in checkExistingUser main catch block", e);
    return "Error occurred";
  }
}

async function insertIntoTable(databaseConnection, data, tableName) {
  try {
    return databaseConnection(tableName)
      .insert(data)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    console.log("Error in insertIntoTable main catch block.", e);
    throw e;
  }
}

async function getUserHistory(databaseConnection, userId) {
  try {
    return databaseConnection(tables.userRequest)
      .select(
        "ub.User_Name as requestedUserName",
        "ur.Request_Id as requestId",
        "ur.Requested_Date as requestedDate",
        "ur.Request_Status as requestStatus",
        "ur.Request_Updated_On as requestUpdatedOn",
        "ur.First_Name as firstName",
        "ur.Last_Name as lastName",
        "ur.Email as email",
        "ur.Mobile_No as mobileNo"
      )
      .from(`${tables.userRequest} as ur`)
      .innerJoin(
        `${tables.userBasicDetails} as ub`,
        "ur.Requested_To",
        "ub.User_Id"
      )
      .where("ur.Requested_By", userId)
      .orderBy("ur.Requested_Date", "desc")
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log("Error in getUserHistory .catch block", e);
        throw e;
      });
  } catch (e) {
    console.log("Error in getUserHistory main catch block", e);
    throw e;
  }
}

async function getPendingRequestToApporve(databaseConnection, userId) {
  try {
    return databaseConnection(tables.userRequest)
      .select(
        "ub.User_Name as requestedUserName",
        "ur.Request_Id as requestId",
        "ur.Requested_Date as requestedDate",
        "ur.Request_Status as requestStatus",
        "ub.Public_Key as publicKey"
      )
      .from(`${tables.userRequest} as ur`)
      .innerJoin(
        `${tables.userBasicDetails} as ub`,
        "ur.Requested_By",
        "ub.User_Id"
      )
      .where("ur.Requested_To", userId)
      .where("ur.Request_Status", "PENDING")
      .orderBy("ur.Requested_Date", "desc")
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log("Error in getPendingRequestToApporve .catch block", e);
        throw e;
      });
  } catch (e) {
    console.log("Error in getPendingRequestToApporve main catch block", e);
    throw e;
  }
}

async function updateRequestTable(
  databaseConnection,
  data,
  tableName,
  requestId
) {
  try {
    return databaseConnection(tableName)
      .update(data)
      .where("Request_Id", requestId)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    console.log("Error in updateRequestTable main catch block.", e);
    throw e;
  }
}
module.exports = {
  checkExistingUser,
  getUserDetailsBasedOnUname,
  getUserDetailsBasedOnUserId,
  getAllUserWithoutAnyPendingRequest,
  insertIntoTable,
  getUserHistory,
  getPendingRequestToApporve,
  updateRequestTable,
};
