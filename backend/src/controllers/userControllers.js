const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// require knex for database connection
var knex = require("knex");

const {
  insertIntoTable,
  checkExistingUser,
  getUserDetailsBasedOnUname,
} = require("../common/commonFunction");

const { tables } = require("../common/tableAlias");
const dbConnection = require("../common/connection");
const { DateTime } = require("luxon");

const signUp = async (req, res) => {
  let SECRET_KEY = process.env.SECRET_KEY;
  const { uName, firstName, lastName, email, mobileNo, password, publicKey } =
    req.body;
  let connectDb = await dbConnection.getDataBaseConnection();
  const databaseConnection = knex(connectDb.connection);
  try {
    let userExist = await checkExistingUser(databaseConnection, uName);

    if (userExist == "User don't exist") {
      const hashPassword = await bcrypt.hash(password, 10);

      let data = {
        User_Name: uName,
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Mobile_No: mobileNo,
        Password: hashPassword,
        Public_Key: publicKey,
        Created_On: DateTime.utc().toISO(),
      };
      let userId = await insertIntoTable(
        databaseConnection,
        data,
        tables.userBasicDetails
      );
      let token = jwt.sign({ userId: userId[0], uName: uName }, SECRET_KEY);
      databaseConnection ? databaseConnection.destroy() : null;
      return res.status(201).json({
        uName: uName,
        token: token,
      });
    } else if (userExist == "User exist") {
      databaseConnection ? databaseConnection.destroy() : null;
      return res.status(400).json({
        message: "The username already exists. Please choose a different one.",
      });
    } else {
      databaseConnection ? databaseConnection.destroy() : null;
      return res
        .status(500)
        .json({ message: "Something went wrong please try again." });
    }
  } catch (e) {
    databaseConnection ? databaseConnection.destroy() : null;
    console.log("Error in signUp main catch block", e);
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

const signIn = async (req, res) => {
  let SECRET_KEY = process.env.SECRET_KEY;
  let connectDb = await dbConnection.getDataBaseConnection();
  const databaseConnection = knex(connectDb.connection);
  const { uName, password } = req.body;
  try {
    let userDetails = await getUserDetailsBasedOnUname(
      databaseConnection,
      uName
    );
    if (userDetails) {
      if (userDetails.length == 0) {
        databaseConnection ? databaseConnection.destroy() : null;
        return res.status(404).json({ message: "User not found" });
      } else {
        userDetails = userDetails[0];
        const matchPassword = await bcrypt.compare(
          password,
          userDetails.Password
        );
        if (!matchPassword) {
          databaseConnection ? databaseConnection.destroy() : null;
          return res.status(400).json({ message: "Invalid Credentials" });
        }

        let token = jwt.sign(
          { userId: userDetails.User_Id, uName: uName },
          SECRET_KEY
        );
        databaseConnection ? databaseConnection.destroy() : null;
        return res.status(200).json({
          uName: uName,
          token: token,
        });
      }
    } else {
      databaseConnection ? databaseConnection.destroy() : null;
      return res
        .status(500)
        .json({ message: "Something went wrong please try again." });
    }
  } catch (e) {
    databaseConnection ? databaseConnection.destroy() : null;
    console.log("Error in signin main catch block", e);
    return res
      .status(500)
      .json({ message: "Something went wrong please try again." });
  }
};

module.exports = { signUp, signIn };
