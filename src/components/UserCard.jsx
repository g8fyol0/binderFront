import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div
      className="relative w-96 bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden 
        shadow-2xl border border-white/20 transition-transform hover:scale-[1.02] duration-300"
    >
      <div className="relative z-10 border border-transparent rounded-3xl overflow-hidden">
        <figure className="w-full h-64 relative">
          <img
            src={photoUrl}
            alt="user profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </figure>

        <div className="card-body text-center px-6 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">
            {firstName} {lastName}
          </h2>

          {age && gender && (
            <div className="flex justify-center gap-3 mb-2">
              <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                Age: {age}
              </span>
              <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-full border border-white/20 capitalize">
                {gender}
              </span>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-300 italic min-h-[40px]">
            {about || "No description provided."}
          </p>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all shadow-md"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all shadow-md"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

// import axios from "axios";
// import React from "react";
// import { BASE_URL } from "../utils/constants";
// import { useDispatch } from "react-redux";
// import { removeUserFromFeed } from "../utils/feedSlice";

// const UserCard = ({ user }) => {
//   const dispatch = useDispatch();
//   const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

//   const handleSendRequest = async (status, userId) => {
//     try {
//       const res = await axios.post(
//         BASE_URL + "/request/send/" + status + "/" + userId,
//         {},
//         { withCredentials: true }
//       );
//       dispatch(removeUserFromFeed(userId));
//     } catch (err) {}
//   };

//   return (
//     <div
//       className="
//         relative
//         w-96
//         bg-base-100
//         rounded-2xl
//         overflow-hidden
//         shadow-2xl
//         before:absolute before:inset-0
//         before:rounded-2xl
//         before:bg-yellow-100
//         before:opacity-40
//         "
//     >
//       {/* Inner “real” card so content stays crisp on top of the glow */}
//       <div className="relative z-10 border border-transparent rounded-2xl overflow-hidden">
//         <figure className="w-full h-64">
//           <img
//             src={photoUrl}
//             alt="user profile"
//             className="w-full h-full object-cover bg-white p-4"
//           />
//         </figure>

//         <div className="card-body text-center">
//           <h2 className="text-xl font-semibold text-gray-100">
//             {firstName} {lastName}
//           </h2>
//           {age && gender && (
//             <p className="text-sm text-gray-400">
//               {age}, {gender}
//             </p>
//           )}
//           <p className="mt-2 text-sm text-gray-300">
//             {about || "No description provided."}
//           </p>
//           <div className="flex justify-center mt-6 space-x-4">
//             <button
//               className="btn bg-red-600 hover:bg-red-700 text-white border-none"
//               onClick={() => handleSendRequest("ignored", _id)}
//             >
//               Ignore
//             </button>
//             <button
//               className="btn bg-green-600 hover:bg-green-700 text-white border-none"
//               onClick={() => handleSendRequest("interested", _id)}
//             >
//               Interested
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserCard;
