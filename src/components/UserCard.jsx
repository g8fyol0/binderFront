import React from "react";

const UserCard = ({ user, onAction }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

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
              onClick={() => onAction(_id, "ignored")}
            >
              Ignore
            </button>
            <button
              className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all shadow-md"
              onClick={() => onAction(_id, "interested")}
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
