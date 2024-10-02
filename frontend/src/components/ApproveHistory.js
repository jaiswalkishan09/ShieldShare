import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const ApproveHistory = () => {
  const cookies = new Cookies();
  const [token] = useState("bearer " + cookies.get("token"));
  const [users, setUsers] = useState(null);
  const formatDate = (isoDate) => {
    const dateTime = DateTime.fromISO(isoDate);
    return dateTime.isValid
      ? dateTime.toLocal().toFormat("yyyy-LL-dd hh:mm a")
      : "Invalid date";
  };
  const [processingRequest, setProcessingRequest] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        };

        // Await the fetch call
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/usersauth/approvalHistory`,
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

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4 ">Approval/Reject History</h2>
      {users ? (
        users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.userId}
                className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between text-gray-800 text-lg font-medium">
                  <div>
                    <strong>Requested By:</strong> {user.requestedUserName}
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
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-2xl font-bold p-4 text-center">
            No Request found.
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

export default ApproveHistory;
