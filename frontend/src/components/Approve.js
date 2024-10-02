import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { encryptData } from "../utils/common";

const Approve = ({ decryptedPersonalData }) => {
  const cookies = new Cookies();
  const [token] = useState("bearer " + cookies.get("token"));
  const [users, setUsers] = useState(null);

  const [processingRequest, setProcessingRequest] = useState({});
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
          `${process.env.REACT_APP_BACKEND_URL}/usersauth/approvalPending`,
          requestOptions
        );

        // Await the conversion to JSON
        const json_res = await response.json();

        // Check the status code
        if (response.status === 200 && json_res) {
          setUsers(json_res.requestData);
        } else {
          alert("Something went wrong please try again.");
        }
      } catch (e) {
        alert("Something went wrong please try again.");
      }
    };

    fetchData();
  }, []);

  async function updateRequest(requestId, status, publicKey) {
    try {
      if (
        status === "REJECTED" ||
        (status === "APPROVED" && Object.keys(decryptedPersonalData).length > 0)
      ) {
        setProcessingRequest({
          ...processingRequest,
          [requestId]: "Processing...",
        });

        let data = {
          requestId: requestId,
          status,
        };
        if (status === "APPROVED") {
          data = {
            requestId: requestId,
            status,
            firstName: await encryptData(
              decryptedPersonalData.firstName,
              publicKey
            ),
            lastName: await encryptData(
              decryptedPersonalData.lastName,
              publicKey
            ),
            email: await encryptData(decryptedPersonalData.email, publicKey),
            mobileNo: await encryptData(
              decryptedPersonalData.mobileNo,
              publicKey
            ),
          };
        }
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify(data),
        };
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/usersauth/updateRequest`,
          requestOptions
        );
        let json_res = await response.json();
        if (response.status === 201) {
          setProcessingRequest({
            ...processingRequest,
            [requestId]: status,
          });
        } else {
          alert("Something went wrong.Please try again latter.");
        }
      } else {
        alert("Please first add valid private key.");
      }
    } catch (e) {
      setProcessingRequest({
        ...processingRequest,
        [requestId]: false,
      });
      alert("Something went wrong.Please try again latter.");
    }
  }
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4 ">Approve/Reject Request</h2>
      {users ? (
        users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.userId}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex flex-col text-gray-800 text-lg font-medium">
                  <span>
                    <strong>Requested By:</strong> {user.requestedUserName}
                  </span>
                  <span className="text-sm text-gray-400">
                    <strong>Request Date:</strong>{" "}
                    {formatDate(user.requestedDate)}
                  </span>
                </div>
                {processingRequest[user.requestId] ? (
                  <span className="text-green-500">
                    {processingRequest[user.requestId]}
                  </span>
                ) : (
                  <div className="flex justify-between gap-2">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg"
                      onClick={() => {
                        updateRequest(user.requestId, "REJECTED");
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg"
                      onClick={() => {
                        updateRequest(
                          user.requestId,
                          "APPROVED",
                          user.publicKey
                        );
                      }}
                    >
                      Approve
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-2xl font-bold p-4 text-center">
            No request has been made yet.
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

export default Approve;
