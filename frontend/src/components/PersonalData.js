import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { decryptData } from "../utils/common";

const PersonalData = ({ privateKey }) => {
  const cookies = new Cookies();
  // Sample data for demonstration purposes
  const [personalData, setPersonalData] = useState(null);
  const [token] = useState("bearer " + cookies.get("token"));
  const [decryptedPersonalData, setDecryptedData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        };

        // Await the fetch call
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/usersauth/getuserDetails`,
          requestOptions
        );

        // Await the conversion to JSON
        const json_res = await response.json();

        // Check the status code
        if (response.status === 200 && json_res) {
          setPersonalData(json_res);
        } else {
          alert("Something went wrong please try again.");
        }
      } catch (e) {
        alert("Something went wrong please try again.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    try {
      async function processPersonalData(params) {
        const objectKeys = Object.keys(params);

        const decryptedDataAll = {};
        for (let i = 0; i < objectKeys.length; i++) {
          if (objectKeys[i] != "userName") {
            const decryptedData = await decryptData(
              params[objectKeys[i]],
              privateKey
            );
            decryptedDataAll[objectKeys[i]] = decryptedData;
          }
        }
        setDecryptedData(decryptedDataAll);
      }

      if (privateKey && personalData) {
        processPersonalData(personalData);
      }
    } catch (e) {
      alert("Error while decrypting data.Please provide valid private key.");
    }
  }, [privateKey]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-bold mb-4">Personal Information</h2>
      {privateKey ? (
        <div>
          <p>
            <strong>First Name:</strong>{" "}
            {decryptedPersonalData.firstName
              ? decryptedPersonalData.firstName
              : "Processing..."}
          </p>
          <p>
            <strong>Last Name:</strong> {decryptedPersonalData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {decryptedPersonalData.email}
          </p>

          <p>
            <strong>Mobile No:</strong> {decryptedPersonalData.mobileNo}
          </p>
        </div>
      ) : (
        <p className="text-gray-600">
          Encrypted: Data cannot be displayed.Please enter a valid private key
          to proceed.
        </p>
      )}
    </div>
  );
};

export default PersonalData;
