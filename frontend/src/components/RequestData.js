import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const RequestData = () => {
  const cookies = new Cookies();
  const [token] = useState("bearer " + cookies.get("token"));
  const [users, setUsers] = useState(null);

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
          `${process.env.REACT_APP_BACKEND_URL}/usersauth/allUsers`,
          requestOptions
        );

        // Await the conversion to JSON
        const json_res = await response.json();

        // Check the status code
        if (response.status === 200 && json_res) {
          setUsers(json_res.userData);
        } else {
          alert("Something went wrong please try again.");
        }
      } catch (e) {
        alert("Something went wrong please try again.");
      }
    };

    fetchData();
  }, []);

  async function requestInfo(requestedTo) {
    try {
      {
        setProcessingRequest((prev) => ({
          ...prev,
          [requestedTo]: "Processing...",
        }));
      }
      let data = {
        requestedTo,
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(data),
      };
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/usersauth/addRequest`,
        requestOptions
      );
      let json_res = await response.json();
      if (response.status === 201) {
        setProcessingRequest((prev) => ({
          ...prev,
          [requestedTo]: "Requested",
        }));
      } else {
        alert("Something went wrong.Please try again latter.");
      }
    } catch (e) {
      setProcessingRequest((prev) => ({
        ...prev,
        [requestedTo]: false,
      }));
      alert("Something went wrong.Please try again latter.");
    }
  }
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4 ">User List</h2>
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
                    <strong>UserName:</strong> {user.userName}
                  </span>
                  <span className="text-sm text-gray-400">
                    Click on the request button to access user information. Once
                    approved, the data will be available in the history.
                  </span>
                </div>
                {processingRequest[user.userId] ? (
                  <span className="text-green-500">
                    {processingRequest[user.userId]}
                  </span>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg"
                    onClick={() => {
                      requestInfo(user.userId);
                    }}
                  >
                    Request Data
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-2xl font-bold p-4 text-center">
            New Users Not Found
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

export default RequestData;
