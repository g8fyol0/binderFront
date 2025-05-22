import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      let res;
      if (mode === "signup") {
        res = await axios.post(
          BASE_URL + "/signup",
          {
            firstName,
            lastName,
            emailId,
            password,
          },
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          BASE_URL + "/login",
          {
            emailId,
            password,
          },
          { withCredentials: true }
        );
      }

      mode === "login"
        ? dispatch(addUser(res.data))
        : dispatch(addUser(res.data.data));
      return mode === "login" ? navigate("/") : navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-14">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {mode === "login" ? "LOGIN!" : "SIGNUP!"}
          </h2>

          {mode === "signup" && (
            <>
              <label className="form-control w-full max-w-xs my-4">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  placeholder="Enter your first name"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-4">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  placeholder="Enter your last name"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </>
          )}

          <label className="form-control w-full max-w-xs my-4">
            <div className="label">
              <span className="label-text">Email ID</span>
            </div>
            <input
              type="email"
              value={emailId}
              placeholder="Enter your email"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          <label className="form-control w-full max-w-xs my-4">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="card-actions flex flex-col items-center gap-2 mt-4">
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              {mode === "login" ? "Login" : "Signup"}
            </button>
            <button
              className="btn btn-link text-sm"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login"
                ? "Don't have an account? Sign up here"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
