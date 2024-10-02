import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { decryptData } from "../utils/common";

const History = ({ privateKey }) => {
  const cookies = new Cookies();
  const [token] = useState("bearer " + cookies.get("token"));
  const [showUserData, setShowUserData] = useState({});
  const [data, setData] = useState(null);
  console.log(showUserData);
  const formatDate = (isoDate) => {
    const dateTime = DateTime.fromISO(isoDate);
    return dateTime.isValid
      ? dateTime.toLocal().toFormat("yyyy-LL-dd hh:mm a")
      : "Invalid date";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        };

        // Await the fetch call
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/usersauth/history`,
          requestOptions
        );

        // Await the conversion to JSON
        const json_res = await response.json();

        // Check the status code
        if (response.status === 200 && json_res) {
          setData(json_res.requestData);
        } else {
          alert("Something went wrong please try again.");
        }
      } catch (e) {
        alert("Something went wrong please try again.");
      }
    };

    fetchData();
  }, []);

  async function processPersonalData(params, requestId) {
    if (privateKey) {
      const objectKeys = Object.keys(params);
      console.log(objectKeys);

      const decryptedDataAll = { requestId };
      for (let i = 0; i < objectKeys.length; i++) {
        if (
          ["firstName", "lastName", "email", "mobileNo"].includes(objectKeys[i])
        ) {
          const decryptedData = await decryptData(
            params[objectKeys[i]],
            privateKey
          );
          decryptedDataAll[objectKeys[i]] = decryptedData;
        }
      }

      setShowUserData(decryptedDataAll);
    } else {
      alert("Please add valid private key");
    }
  }

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4 ">History</h2>
      {data ? (
        data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((user) => (
              <li
                key={user.requestId}
                className="flex flex-col justify-center bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between text-gray-800 text-lg font-medium">
                  <div>
                    <strong>Requested To:</strong> {user.requestedUserName}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <span
                      className={`text-lg font-bold ${
                        user.requestStatus === "PENDING"
                          ? "text-gray-600"
                          : user.requestStatus === "REJECTED"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {user.requestStatus}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Requested Date:</strong>{" "}
                      {formatDate(user.requestedDate)}
                    </p>
                    {user.requestUpdatedOn ? (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Updated Date:</strong>{" "}
                        {formatDate(user.requestUpdatedOn)}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  {user.requestStatus === "APPROVED" ? (
                    <div>
                      {showUserData["requestId"] != user.requestId ? (
                        <button
                          onClick={() =>
                            processPersonalData(user, user.requestId)
                          }
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                          View Data
                        </button>
                      ) : (
                        <div className="mt-4 space-y-2 bg-white p-4 rounded-lg shadow-inner">
                          <p>
                            <strong>First Name:</strong>{" "}
                            {showUserData.firstName}
                          </p>
                          <p>
                            <strong>Last Name:</strong> {showUserData.lastName}
                          </p>
                          <p>
                            <strong>Email:</strong> {showUserData.email}
                          </p>
                          <p>
                            <strong>Mobile No:</strong> {showUserData.mobileNo}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-2xl font-bold p-4 text-center">
            No requests have been made yet.
          </div>
        )
      ) : (
        <ul className="space-y-4 ">
          {[1, 2, 3, 4].map((i) => (
            <li
              key={i}
              className="animate-pulse bg-slate-200 w-full h-14 rounded-lg"
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
