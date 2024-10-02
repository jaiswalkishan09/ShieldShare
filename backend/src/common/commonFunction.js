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

async function insertIntoTable(databaseConnection, data, tableName) {
  try {
    return databaseConnection(tableName)
      .insert(data)
      .then((userId) => {
        return userId[0];
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    console.log("Error in insertIntoTable main catch block.", e);
    return false;
  }
}

module.exports = {
  insertIntoTable,
  checkExistingUser,
  getUserDetailsBasedOnUname,
  getUserDetailsBasedOnUserId,
  getAllUserWithoutAnyPendingRequest,
  insertIntoTable,
};
