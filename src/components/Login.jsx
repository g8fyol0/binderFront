import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login", "signup", or "verify"
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

        if (res.data.requiresVerification) {
          setMode("verify");
          setMessage(res.data.message);
          setError(""); // Clear any previous errors
          return;
        }
      } else if (mode === "login") {
        res = await axios.post(
          BASE_URL + "/login",
          {
            emailId,
            password,
          },
          { withCredentials: true }
        );

        if (res.data.requiresVerification) {
          setMode("verify");
          setMessage("Please verify your email to continue.");
          return;
        }
      } else if (mode === "verify") {
        res = await axios.post(
          BASE_URL + "/verify-otp",
          {
            emailId,
            otp,
          },
          { withCredentials: true }
        );
      }

      // Clear error before navigation
      setError("");

      if (mode === "verify") {
        dispatch(addUser(res.data));
        navigate("/profile"); // Changed back to /profile as requested
      } else if (mode === "login") {
        dispatch(addUser(res.data));
        navigate("/");
      } else {
        dispatch(addUser(res.data.data));
        navigate("/profile");
      }
    } catch (err) {
      // Display the exact error message from the backend
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/resend-otp",
        { emailId },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (
    <div className="flex justify-center my-14">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {mode === "login"
              ? "LOGIN!"
              : mode === "signup"
              ? "SIGNUP!"
              : "VERIFY EMAIL!"}
          </h2>

          {mode === "verify" && message && (
            <div className="alert alert-info">
              <span>{message}</span>
            </div>
          )}

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

          {mode !== "verify" && (
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
          )}

          {mode !== "verify" && (
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
          )}

          {mode === "verify" && (
            <>
              <label className="form-control w-full max-w-xs my-4">
                <div className="label">
                  <span className="label-text">
                    Enter OTP sent to your email
                  </span>
                </div>
                <input
                  type="text"
                  value={otp}
                  placeholder="Enter 6-digit OTP"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </label>
              <button
                className="btn btn-link text-sm"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="card-actions flex flex-col items-center gap-2 mt-4">
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              {mode === "login"
                ? "Login"
                : mode === "signup"
                ? "Signup"
                : "Verify"}
            </button>

            {mode !== "verify" && (
              <button
                className="btn btn-link text-sm"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                  setMessage("");
                }}
              >
                {mode === "login"
                  ? "Don't have an account? Sign up here"
                  : "Already have an account? Login"}
              </button>
            )}

            {mode === "verify" && (
              <button
                className="btn btn-link text-sm"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                  setOtp("");
                }}
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
