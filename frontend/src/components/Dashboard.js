import React, { useState } from "react";
import PersonalData from "./PersonalData";

const Dashboard = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("personal");

  const handleInputChange = (e) => {
    setPrivateKey(e.target.value);
  };

  const handleButtonClick = (type) => {
    console.log(`${type} clicked!`);
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
      <div className="w-full max-w-md grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={() => handleButtonClick("Personal Information")}
          className={`${
            selectedComponent === "personal"
              ? "bg-blue-700 font-bold"
              : "bg-blue-500"
          } text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:font-bold  w-full `}
        >
          Personal Information
        </button>
        <button
          onClick={() => handleButtonClick("Other Users")}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 w-full"
        >
          Other Users
        </button>
        <button
          onClick={() => handleButtonClick("History")}
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 w-full"
        >
          History
        </button>
      </div>
      {selectedComponent === "personal" && (
        <PersonalData privateKey={privateKey} />
      )}
      {/* {selectedComponent === "history" &&} */}
    </div>
  );
};

export default Dashboard;
