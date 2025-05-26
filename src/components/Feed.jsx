import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Get initial feed or load more users
  const getFeed = async (pageNum = 1, append = false) => {
    if (feed && pageNum === 1 && !append) return;
    
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/feed?page=${pageNum}&limit=10`, {
        withCredentials: true,
      });
      
      if (append && feed) {
        // Append new users to existing feed
        const newUsers = res?.data?.data || [];
        dispatch(addFeed([...feed, ...newUsers]));
      } else {
        // Replace feed entirely
        dispatch(addFeed(res?.data?.data || []));
      }
      
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we need to load more users
  useEffect(() => {
    if (!isSearchMode && feed && feed.length < 5 && !isLoading) {
      getFeed(page + 1, true);
    }
  }, [feed, isSearchMode, isLoading]);

  // Initial feed load
  useEffect(() => {
    getFeed();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setIsSearchMode(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/search?query=${encodeURIComponent(searchQuery)}`,
        { withCredentials: true }
      );
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnectionAction = async (userId, actionType) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${actionType}/${userId}`,
        {},
        { withCredentials: true }
      );
      
      // Remove user from display regardless of which list they're in
      if (isSearchMode) {
        setSearchResults(prev => prev.filter(u => u._id !== userId));
      } else if (feed) {
        dispatch(addFeed(feed.filter(u => u._id !== userId)));
      }
      
      setActionMessage(""); // Clear any previous error messages
      
      // Check if we need to load more users after removing one
      if (!isSearchMode && feed && feed.length <= 5) {
        getFeed(page + 1, true);
      }
      
    } catch (err) {
      console.error("Action error", err);
      // Display error message from backend
      if (err.response?.data?.message === "connection request already exists!!") {
        setActionMessage("You've already acted on this profile");
        
        // Also remove the card since it's already been acted upon
        if (isSearchMode) {
          setSearchResults(prev => prev.filter(u => u._id !== userId));
        } else if (feed) {
          dispatch(addFeed(feed.filter(u => u._id !== userId)));
        }
        
        // Check if we need to load more users after removing one
        if (!isSearchMode && feed && feed.length <= 5) {
          getFeed(page + 1, true);
        }
        
        // Clear the message after 3 seconds
        setTimeout(() => setActionMessage(""), 3000);
      } else {
        setActionMessage(err.response?.data?.message || "An error occurred");
      }
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchMode(false);
    setActionMessage("");
    // Ensure we have enough cards in the feed
    if (!feed || feed.length < 10) {
      getFeed(1, false);
    }
  };

  const usersToDisplay = isSearchMode ? searchResults : feed;

  if (!feed) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4 text-center">
        {isSearchMode ? (
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="flex gap-2 my-4 w-full">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="input input-bordered rounded-full w-full px-4"
              />
              <button
                className="btn btn-primary rounded-full px-6"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
            <button 
              className="btn btn-outline btn-sm mt-2"
              onClick={resetSearch}
            >
              Back to Feed
            </button>
          </div>
        ) : (
          <div className="flex gap-2 my-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="input input-bordered rounded-full w-full px-4"
            />
            <button
              className="btn btn-primary rounded-full px-6"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        )}

        <h2 className="text-2xl font-semibold m-2">
          {isSearchMode ? "Search Results" : "Connect with people"}
        </h2>
        {actionMessage && (
          <div className="mt-2 text-red-500">{actionMessage}</div>
        )}
      </div>

      {usersToDisplay?.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-semibold mb-2">
            {isSearchMode ? "No users found" : "No users available"}
          </h2>
          {isSearchMode && (
            <p className="text-gray-500">Try searching with a different name.</p>
          )}
          {!isSearchMode && (
            <p className="text-gray-500">Check back later for new connections.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 p-4">
          {usersToDisplay.map((user) => (
            <UserCard 
              key={user._id} 
              user={user} 
              onAction={handleConnectionAction}
            />
          ))}
          {isLoading && (
            <div className="w-full text-center py-4">
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Feed;
