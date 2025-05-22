import React, { useState } from "react";
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
      {/* Success Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fade-in">
              <h2 className="text-xl font-bold text-green-600 mb-4 text-center">
                ✅ Profile Updated Successfully!
              </h2>
              <p className="text-gray-700 text-center">
                Your changes have been saved.
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

      <div className="flex flex-col md:flex-row justify-center items-start gap-10 p-6">
        <div className="flex justify-center my-4 md:my-0">
          <div className="card bg-base-300 w-[28rem] shadow-xl rounded-xl border border-blue-400">
            <div className="card-body">
              <h2 className="card-title justify-center mb-6 text-2xl font-bold text-blue-200">
                Edit Profile
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="w-1/3 text-sm font-medium text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="Enter first name"
                    className="input input-bordered w-2/3"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="w-1/3 text-sm font-medium text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Enter last name"
                    className="input input-bordered w-2/3"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="w-1/3 text-sm font-medium text-gray-300">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    placeholder="Enter new photoUrl"
                    className="input input-bordered w-2/3"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="w-1/3 text-sm font-medium text-gray-300">
                    Age
                  </label>
                  <input
                    type="text"
                    value={age}
                    placeholder="Enter age"
                    className="input input-bordered w-2/3"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="w-1/3 text-sm font-medium text-gray-300">
                    About
                  </label>
                  <input
                    type="text"
                    value={about}
                    placeholder="About you"
                    className="input input-bordered w-2/3"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="w-1/3 text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select select-bordered w-2/3"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>

              <p className="text-red-500 text-center mt-4">{error}</p>

              <div className="card-actions justify-center mt-6">
                <button className="btn btn-primary px-8" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, about, age, photoUrl, gender }}
        />
      </div>
    </>
  );
};

export default EditProfile;

// import React, { useState } from "react";
// import UserCard from "./UserCard";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";
// import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";

// const EditProfile = ({ user }) => {
//   const [firstName, setFirstName] = useState(user.firstName || "");
//   const [lastName, setLastName] = useState(user.lastName || "");
//   const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
//   const [age, setAge] = useState(user.age || "");
//   const [about, setAbout] = useState(user.about || "");
//   const [gender, setGender] = useState(user.gender || "");
//   const [error, setError] = useState("");

//   const dispatch = useDispatch();

//   const saveProfile = async () => {
//     setError("");
//     try {
//       const res = await axios.patch(
//         BASE_URL + "/profile/edit",
//         {
//           firstName,
//           lastName,
//           about,
//           age,
//           photoUrl,
//           gender,
//         },
//         { withCredentials: true }
//       );
//       dispatch(addUser(res?.data?.data));
//     } catch (err) {
//       setError(err.response.data);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row justify-center items-start gap-10 p-6">
//       <div className="flex justify-center my-4 md:my-0">
//         <div className="card bg-base-300 w-[28rem] shadow-xl rounded-xl border border-blue-400">
//           <div className="card-body">
//             <h2 className="card-title justify-center mb-6 text-2xl font-bold text-blue-200">
//               Edit Profile
//             </h2>

//             <div className="space-y-6">
//               {/* Field Group */}
//               <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   value={firstName}
//                   placeholder="Enter first name"
//                   className="input input-bordered w-2/3"
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   value={lastName}
//                   placeholder="Enter last name"
//                   className="input input-bordered w-2/3"
//                   onChange={(e) => setLastName(e.target.value)}
//                 />
//               </div>
//               <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   photo URL
//                 </label>
//                 <input
//                   type="text"
//                   value={photoUrl}
//                   placeholder="Enter new photoUrl"
//                   className="input input-bordered w-2/3"
//                   onChange={(e) => setPhotoUrl(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   Age
//                 </label>
//                 <input
//                   type="text"
//                   value={age}
//                   placeholder="Enter age"
//                   className="input input-bordered w-2/3"
//                   onChange={(e) => setAge(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   About
//                 </label>
//                 <input
//                   type="text"
//                   value={about}
//                   placeholder="About you"
//                   className="input input-bordered w-2/3"
//                   onChange={(e) => setAbout(e.target.value)}
//                 />
//               </div>

//               {/* <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   Gender
//                 </label>
//                 <input
//                   type="text"
//                   value={gender}
//                   placeholder="Gender"
//                   className="input input-bordered w-2/3"
//                   onChange={(e) => setGender(e.target.value)}
//                 />
//               </div> */}
//               <div className="flex items-center justify-between">
//                 <label className="w-1/3 text-sm font-medium text-gray-300">
//                   Gender
//                 </label>
//                 <select
//                   value={gender}
//                   onChange={(e) => setGender(e.target.value)}
//                   className="select select-bordered w-2/3"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">male</option>
//                   <option value="female">female</option>
//                   <option value="other">other</option>
//                 </select>
//               </div>
//             </div>

//             <p className="text-red-500 text-center mt-4">{error}</p>

//             <div className="card-actions justify-center mt-6">
//               <button className="btn btn-primary px-8" onClick={saveProfile}>
//                 Save Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <UserCard user={{ firstName, lastName, about, age, photoUrl, gender }} />
//     </div>
//   );
// };

// export default EditProfile;
