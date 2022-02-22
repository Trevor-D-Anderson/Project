import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const lh = "http://localhost:5000";

const regexEmail = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
const regexPassword = new RegExp(
  /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/
);

const UserForm = (props) => {
  const [firstName, set_firstName] = useState("");
  const [lastName, set_lastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, set_firstNameError] = useState("");
  const [lastNameError, set_lastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const navigate = useNavigate();

  const createUser = (e) => {
    e.preventDefault();
    const newUser = {
      firstName,
      lastName,
      email,
      password,
    };
    console.log("Welcome", newUser);
    axios.post(`${lh}/create_user`, newUser).then((res) => {
      console.log(res.data);
      localStorage.setItem("Logged In", "true");
      navigate("/private");
    });
    set_firstName("");
    set_lastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  const handle_first_name = (e) => {
    set_firstName(e.target.value);
    if (e.target.value.length < 2 && e.target.value.length > 0) {
      set_firstNameError("First Name must be 2 or more characters");
    } else {
      set_firstNameError("");
    }
  };
  const handle_last_name = (e) => {
    set_lastName(e.target.value);
    if (e.target.value.length < 2 && e.target.value.length > 0) {
      set_lastNameError("Last Name must be 2 or more characters");
    } else {
      set_lastNameError("");
    }
  };
  const handle_Email = (e) => {
    setEmail(e.target.value);
    if (regexEmail.test(e.target.value)) {
      setEmailError("");
    } else if (e.target.value < 1) {
      setEmailError("");
    } else {
      setEmailError("Email must be valid");
    }
  };
  const handle_Password = (e) => {
    setPassword(e.target.value);
    // if (regexPassword.test(e.target.value)) {
    //   setPasswordError("");
    // }
    if (e.target.value < 1) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must be more than 8 characters and contain 1 of Each of the following: Lowercase letter, Uppercase Letter, Number"
      );
    }
  };
  const handle_ConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value.length < 1 || e.target.value === password) {
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError("Passwords Must Match");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <nav className="flex flex-row justify-around w-[1000px]">
        <h1 className=" text-4xl font-bold mb-2">Freight Calculator</h1>
        <Link className=" text-blue-500 underline" to="/">
          Calculator
        </Link>
      </nav>
      <div className="max-w-lg mt-4 flex flex-col text-xl">
        <form
          className="border-2 border-solid rounded-lg border-blue-400 p-4"
          onSubmit={createUser}
        >
          <h2 className="text-2xl font-bold">Register</h2>
          <div className="flex justify-between">
            <label className=" relative top-2">First Name: </label>
            <input
              className="rounded m-2 border-2 border-solid border-blue-200"
              type="text"
              value={firstName}
              onChange={handle_first_name}
            />
          </div>
          {firstNameError ? <p>{firstNameError}</p> : null}
          <div className="flex justify-between">
            <label className="relative top-2">Last Name: </label>
            <input
              className="rounded m-2 border-2 border-solid border-blue-200"
              type="text"
              value={lastName}
              onChange={handle_last_name}
            />
          </div>
          {lastNameError ? <p>{lastNameError}</p> : null}
          <div className="flex justify-between">
            <label className="relative top-2">Email Address: </label>
            <input
              className="rounded m-2 border-2 border-solid border-blue-200"
              value={email}
              type="text"
              onChange={handle_Email}
            />
          </div>
          {emailError ? <p>{emailError}</p> : null}
          <div className="flex justify-between">
            <label className="relative top-2">Password: </label>
            <input
              className="rounded m-2 border-2 border-solid border-blue-200"
              value={password}
              type="password"
              onChange={handle_Password}
            />
          </div>
          {passwordError ? (
            <p className="break-words">{passwordError}</p>
          ) : null}
          <div className="flex justify-between">
            <label className="relative top-2">Confirm Password: </label>
            <input
              className="rounded m-2 border-2 border-solid border-blue-200"
              value={confirmPassword}
              type="password"
              onChange={handle_ConfirmPassword}
            />
            {confirmPasswordError ? <p>{confirmPasswordError}</p> : null}
          </div>
          <button
            className="w-32 mt-4 border shadow-md rounded-md bg-green-400 hover:bg-gray-100 p-1"
            type="submit"
          >
            Create User
          </button>
        </form>
        <div className="border-2 border-solid rounded-lg border-blue-400 p-4 mt-4">
          <h2 className="text-xl">First Name: {firstName}</h2>
          <h2 className="text-xl mt-4">Last Name: {lastName}</h2>
          <h2 className="text-xl mt-4">Email: {email}</h2>
          <h2 className="text-xl mt-4">Password: {password}</h2>
          <h2 className="text-xl mt-4">Confirm Password: {confirmPassword}</h2>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
