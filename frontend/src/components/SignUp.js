import Cookies from "universal-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrypotGenerator from "./CrypotGenerator";
import { encryptData } from "../utils/common";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [userNameCheck, setUserNameCheck] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameCheck, setFirstNameCheck] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameCheck, setLastNameCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileCheck, setMobileCheck] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const handleLogIn = () => navigate("/");
  const handleMiddleware = () => navigate("/dashboard");

  const userNameSet = (e) => {
    setUserName(e.target.value);

    e.target.value.length > 0
      ? setUserNameCheck(false)
      : setUserNameCheck(true);
  };

  const firstNameSet = (e) => {
    setFirstName(e.target.value);
    let firstLastNameValidation = /^[A-Za-z]+$/;
    firstLastNameValidation.test(e.target.value)
      ? setFirstNameCheck(false)
      : setFirstNameCheck(true);
  };

  const lastNameSet = (e) => {
    setLastName(e.target.value);
    let firstLastNameValidation = /^[A-Za-z]+$/;
    firstLastNameValidation.test(e.target.value)
      ? setLastNameCheck(false)
      : setLastNameCheck(true);
  };

  const emailSet = (e) => {
    setEmail(e.target.value);
    let emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,24}$/;
    emailValidation.test(e.target.value)
      ? setEmailCheck(false)
      : setEmailCheck(true);
  };

  const mobileSet = (e) => {
    setMobile(e.target.value);
    let numberValidation = /^[0-9]+$/;
    numberValidation.test(e.target.value) && e.target.value.length >= 8
      ? setMobileCheck(false)
      : setMobileCheck(true);
  };

  const passwordSet = (e) => {
    setPassword(e.target.value);
    e.target.value && e.target.value.length >= 8
      ? setPasswordCheck(false)
      : setPasswordCheck(true);
  };
  const validateUserInput = () => {
    if (!userName) {
      setUserNameCheck(true);
      return true;
    } else if (!firstName) {
      setFirstNameCheck(true);
      return true;
    } else if (!lastName) {
      setLastNameCheck(true);
      return true;
    } else if (!email) {
      setEmailCheck(true);
      return true;
    } else if (!mobile) {
      setMobileCheck(true);
      return true;
    } else if (!password) {
      setPasswordCheck(true);
      return true;
    } else {
      return false;
    }
  };
  const createUser = async () => {
    try {
      if (
        !validateUserInput() &&
        !firstNameCheck &&
        !lastNameCheck &&
        !emailCheck &&
        !mobileCheck &&
        !passwordCheck &&
        !userNameCheck &&
        localStorage.getItem("publicKey")
      ) {
        setLoader(true);
        let data = {
          publicKey: localStorage.getItem("publicKey"),
          uName: userName,
          firstName: await encryptData(
            firstName,
            localStorage.getItem("publicKey")
          ),
          lastName: await encryptData(
            lastName,
            localStorage.getItem("publicKey")
          ),
          email: await encryptData(email, localStorage.getItem("publicKey")),
          mobileNo: await encryptData(
            mobile,
            localStorage.getItem("publicKey")
          ),
          password: password,
        };
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          requestOptions
        );
        let json_res = await response.json();
        if (response.status === 201) {
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
        alert("Please sign up all the fields with valid data.");
      }
    } catch (err) {
      setLoader(false);
      alert("Something went wrong please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!loader ? (
        <form className="bg-white p-8 shadow-lg rounded-lg w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Please Sign Up
          </h1>
          <div className="mb-4">
            <label className="block text-gray-700">New User Name*:</label>
            <input
              type="text"
              placeholder="New User Name"
              onChange={userNameSet}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {firstNameCheck && (
              <p className="text-red-500 text-sm">
                Please provide a valid User Name.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">First Name*:</label>
            <input
              type="text"
              placeholder="First Name"
              onChange={firstNameSet}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {firstNameCheck && (
              <p className="text-red-500 text-sm">
                Please provide a valid first name.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Last Name*:</label>
            <input
              type="text"
              placeholder="Last Name"
              onChange={lastNameSet}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {lastNameCheck && (
              <p className="text-red-500 text-sm">
                Please provide a valid last name.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email Address*:</label>
            <input
              type="email"
              placeholder="Email Address"
              onChange={emailSet}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {emailCheck && (
              <p className="text-red-500 text-sm">
                Please provide a valid email address.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mobile Number*:</label>
            <input
              type="text"
              placeholder="Mobile Number"
              onChange={mobileSet}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {mobileCheck && (
              <p className="text-red-500 text-sm">
                Please provide a valid mobile number.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">New Password*:</label>
            <input
              type="password"
              placeholder="New Password"
              onChange={passwordSet}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {passwordCheck && (
              <p className="text-red-500 text-sm">
                Password must be at least 8 characters long.
              </p>
            )}
          </div>

          <CrypotGenerator />

          <button
            type="button"
            onClick={createUser}
            className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
          >
            Sign Up
          </button>

          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <button onClick={handleLogIn} className="text-blue-500 underline">
                Log In
              </button>
            </p>
          </div>
        </form>
      ) : (
        <p className="text-xl font-bold text-blue-600">Please Wait...</p>
      )}
    </div>
  );
}

export default SignUp;
