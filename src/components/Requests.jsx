import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      setModalMessage(`Request ${status} successfully!`);
      setShowModal(true);
      fetchRequest(); // Re-fetch to update the list
    } catch (err) {
      setModalMessage("Something went wrong.");
      setShowModal(true);
    }
  };

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-28 px-6 text-center py-20">
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <h1 className="text-2xl font-semibold text-white mb-2">
          No Requests Found
        </h1>
        <p className="text-gray-400 max-w-md">
          You don’t have any pending connection requests right now. When someone
          sends you a request, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="mb-4">{modalMessage}</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-24 mt-20 pb-20">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;
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
                <p className="text-sm text-gray-300 mb-4">
                  {about || "No description available."}
                </p>
                <div className="flex justify-between gap-4">
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    Reject
                  </button>
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Requests;
