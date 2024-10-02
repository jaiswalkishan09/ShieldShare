import React, { useEffect, useState } from "react";
import PersonalData from "./PersonalData";
import RequestData from "./RequestData";
import History from "./History";
import Approve from "./Approve";
import ApproveHistory from "./ApproveHistory";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../utils/common";

const Dashboard = () => {
  const navigate = useNavigate();
  const [privateKey, setPrivateKey] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("personal");
  const [personalData, setPersonalData] = useState(null);
  const [decryptedPersonalData, setDecryptedData] = useState({});
  const cookies = new Cookies();
  const [token] = useState("bearer " + cookies.get("token"));

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
  }, [privateKey, personalData]);

  const handleLogout = () => {
    const cookies = new Cookies();
    localStorage.clear();
    cookies.remove("token");
    navigate("/");
  };

  const handleInputChange = (e) => {
    setPrivateKey(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col ">
      {/* Header */}
      <div className="w-full bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between">
          <h1 className="text-center text-3xl font-bold mb-4">Dashboard</h1>
          <button
            type="button"
            className="font-bold hover:text-red-500 text-black"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>

        <h2 className="text-lg font-bold">
          User Name: {localStorage.getItem("uName")}
        </h2>
        <div className="flex flex-col items-center w-full">
          <label htmlFor="privateKey" className="text-sm mb-2 font-semibold">
            Enter Private Key To Decrypt Data
          </label>
          <input
            id="privateKey"
            type="text"
            value={privateKey}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Paste your private key here"
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-5">
        <button
          onClick={() => setSelectedComponent("personal")}
          className={`${
            selectedComponent === "personal"
              ? "bg-blue-700 font-bold"
              : "bg-blue-500 font-medium"
          } text-white py-4 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:font-bold  w-full `}
        >
          Personal Information
        </button>
        <button
          onClick={() => setSelectedComponent("request")}
          className={`${
            selectedComponent === "request"
              ? "bg-gray-700 font-bold"
              : "bg-gray-500 font-medium"
          } text-white py-4 px-4 rounded-lg shadow-md hover:bg-gray-700 hover:font-bold w-full`}
        >
          Request Users Data
        </button>
        <button
          onClick={() => setSelectedComponent("approve")}
          className={`${
            selectedComponent === "approve"
              ? "bg-green-700 font-bold"
              : "bg-green-500 font-medium"
          } text-white py-4 px-4 rounded-lg shadow-md hover:bg-green-700 hover:font-bold w-full`}
        >
          Approve User Request
        </button>

        <button
          onClick={() => setSelectedComponent("history")}
          className="bg-pink-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-pink-600 w-full"
        >
          Requested Data History
        </button>
        <button
          onClick={() => setSelectedComponent("approvehistory")}
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 w-full"
        >
          Approve/Reject Data History
        </button>
      </div>
      {selectedComponent === "personal" && (
        <PersonalData decryptedPersonalData={decryptedPersonalData} />
      )}
      {selectedComponent === "request" && <RequestData />}
      {selectedComponent === "history" && <History privateKey={privateKey} />}
      {selectedComponent === "approve" && (
        <Approve decryptedPersonalData={decryptedPersonalData} />
      )}
      {selectedComponent === "approvehistory" && <ApproveHistory />}
    </div>
  );
};

export default Dashboard;
