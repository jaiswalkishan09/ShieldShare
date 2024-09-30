// require knex for database connection
var knex = require("knex");

const dbConnection = require("../common/connection");

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
      userId: userId,
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

module.exports = {
  getUserDetails,
};
