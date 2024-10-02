import React, { useState } from "react";
import PersonalData from "./PersonalData";
import RequestData from "./RequestData";
import History from "./History";
import Approve from "./Approve";

const Dashboard = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("personal");

  const [decryptedPersonalData, setDecryptedData] = useState({});

  const handleInputChange = (e) => {
    setPrivateKey(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col ">
      {/* Header */}
      <div className="w-full bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-center text-3xl font-bold mb-4">Dashboard</h1>
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
      <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-4">
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
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 w-full"
        >
          History
        </button>
      </div>
      {selectedComponent === "personal" && (
        <PersonalData
          privateKey={privateKey}
          decryptedPersonalData={decryptedPersonalData}
          setDecryptedData={setDecryptedData}
        />
      )}
      {selectedComponent === "request" && <RequestData />}
      {selectedComponent === "history" && <History />}
      {selectedComponent === "approve" && (
        <Approve decryptedPersonalData={decryptedPersonalData} />
      )}
    </div>
  );
};

export default Dashboard;
