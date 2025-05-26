import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [about, setAbout] = useState(user.about || "");
  const [gender, setGender] = useState(user.gender || "");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhotoUrl(user.photoUrl || "");
    setAge(user.age || "");
    setAbout(user.about || "");
  }, [user]);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          about,
          age,
          photoUrl,
          gender,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowModal(true);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      {/* ✅ Success Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl px-8 py-6 max-w-sm w-full animate-fade-in">
              <h2 className="text-2xl font-semibold text-green-600 text-center mb-3">
                ✅ Profile Updated!
              </h2>
              <p className="text-gray-700 text-center">
                Your profile has been successfully saved.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  className="btn btn-success px-6"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ Layout */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 p-6">
        {/* 👉 Left: Form Card */}
        <div className="flex justify-center my-4 md:my-0">
          <div className="w-[28rem] bg-white/5 backdrop-blur-lg border border-blue-400/30 shadow-2xl rounded-2xl p-6">
            <h2 className="text-center text-2xl font-bold text-blue-300 mb-6">
              ✏️ Edit Profile
            </h2>

            <div className="space-y-5">
              {[
                {
                  label: "First Name",
                  value: firstName,
                  setValue: setFirstName,
                },
                { label: "Last Name", value: lastName, setValue: setLastName },
                { label: "Photo URL", value: photoUrl, setValue: setPhotoUrl },
                { label: "Age", value: age, setValue: setAge },
                { label: "About", value: about, setValue: setAbout },
              ].map(({ label, value, setValue }) => (
                <div key={label} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-200 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="input input-bordered w-full bg-white/10 text-white placeholder:text-gray-400"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              ))}

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-200 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full bg-white/10 text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              <div className="flex justify-center">
                <button
                  className="btn btn-primary w-full tracking-wide uppercase"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 👉 Right: Card Preview */}
        <div className="flex flex-col items-center gap-3 mt-6 md:mt-0">
          <div className="text-lg font-medium text-white tracking-wide">
            Your Card Preview
          </div>
          <UserCard
            user={{ firstName, lastName, about, age, photoUrl, gender }}
          />
        </div>
      </div>
    </>
  );
};

export default EditProfile;
