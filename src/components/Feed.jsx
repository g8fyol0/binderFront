import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector, useStore } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  //reading the feed from redux store
  const feed = useSelector((store) => {
    return store.feed;
  });
  const dispatch = useDispatch();
  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      // console.log(res);
      dispatch(addFeed(res?.data?.data));
    } catch (err) {}
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;
  if (feed.length <= 0)
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-semibold mb-2">You're all caught up!</h2>
        <p className="text-gray-500">
          No more users in your feed right now. Try again later to connect with
          more people.
        </p>
      </div>
    );
  return (
    feed && (
      <div className="flex justify-center my-20">
        <div className="flex flex-wrap gap-6 justify-center">
          {/* First card */}
          {feed.length > 0 && <UserCard user={feed[0]} />}
          
          {/* Second card */}
          {feed.length > 1 && <UserCard user={feed[1]} />}
        </div>
      </div>
    )
  );
};

export default Feed;
