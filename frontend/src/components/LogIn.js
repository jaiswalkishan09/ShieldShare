import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
  const [userName, setUserName] = useState("");
  const [userNameCheck, setUserNameCheck] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(true);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const handleSignUp = () => navigate("/signup");
  const handleMiddleware = () => navigate("/dashboard");

  const userNameSet = (e) => {
    setUserName(e.target.value);
    if (e.target.value && e.target.value.length > 0) {
      setUserNameCheck(false);
    } else {
      setUserNameCheck(true);
    }
  };

  const passwordSet = (e) => {
    setPassword(e.target.value);
    e.target.value && e.target.value.length >= 8
      ? setPasswordCheck(false)
      : setPasswordCheck(true);
  };

  const loginUser = async () => {
    try {
      if (!userNameCheck && !passwordCheck) {
        setLoader(true);
        let data = {
          uName: userName,
          password: password,
        };
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/signin`,
          requestOptions
        );
        let json_res = await response.json();
        if (response.status === 200) {
          const cookies = new Cookies();
          cookies.set("token", json_res.token);
          localStorage.setItem("uName", json_res.uName);
          handleMiddleware();
          setLoader(false);
        } else {
          setLoader(false);
          alert(json_res.message);
        }
      } else {
        alert("Please fill the fields with valid data.");
      }
    } catch (err) {
      setLoader(false);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {!loader ? (
        <form className="w-full max-w-md bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Please Sign In</h1>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              User Name:
            </label>
            <input
              type="userName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="User Name"
              onChange={userNameSet}
            />
            {userNameCheck && (
              <p className="text-red-500 text-xs italic">
                Please provide a valid userName.
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              onChange={passwordSet}
            />
            {passwordCheck && (
              <p className="text-red-500 text-xs italic">
                Please provide a valid password (at least 8 characters).
              </p>
            )}
          </div>

          {/* Log In Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={loginUser}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Log In
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleSignUp}
                className="text-blue-500 hover:text-blue-700"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-700">Please Wait...</p>
      )}
    </div>
  );
}

export default Login;
