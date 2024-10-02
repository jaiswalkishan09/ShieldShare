import React, { useState, useEffect } from "react";

const PersonalData = ({ decryptedPersonalData }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-bold mb-4">Personal Information</h2>
      {decryptedPersonalData &&
      Object.keys(decryptedPersonalData).length > 0 ? (
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
