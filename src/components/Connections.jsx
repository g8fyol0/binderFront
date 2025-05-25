import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  //getting connections from store
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      //   console.log(res?.data?.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-28 px-6 text-center">
        {/* Inline beautiful SVG illustration */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-48 text-gray-400 mb-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21c1-4 5-6 6.5-6s5.5 2 6.5 6" />
          <line x1="3" y1="3" x2="21" y2="21" />
        </svg>

        <h1 className="text-2xl font-semibold text-white mb-2">
          No Connections Found
        </h1>
        <p className="text-gray-400 max-w-md">
          Looks like you haven't made any connections yet. Start discovering new
          people and grow your network!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-24 mt-20">
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;
        return (
          <div
            key={_id}
            className="w-80 bg-[#1e293b] rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
          >
            <img
              alt="user"
              className="w-full h-64 object-cover bg-white"
              src={photoUrl}
            />
            <div className="p-4 text-left text-white">
              <h2 className="text-xl font-semibold mb-1">
                {firstName + " " + lastName}
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                {age}, {gender}
              </p>
              <p className="text-sm text-gray-300">
                {about || "No description available."}
              </p>
            </div>

            <Link to={"/chat/" + _id}>
              <button className="btn ml-28 my-6 btn-secondary">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
