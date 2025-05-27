import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getFeed = async (pageNum = 1, append = false) => {
    if (!hasMore && append) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/feed?page=${pageNum}&limit=10`, {
        withCredentials: true,
      });

      const newUsers = res?.data?.data || [];

      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
        if (append) {
          const allUsers = [...feed, ...newUsers];
          const uniqueUsers = [
            ...new Map(allUsers.map((u) => [u._id, u])).values(),
          ];
          setFeed(uniqueUsers);
        } else {
          setFeed(newUsers);
        }
        setPage(pageNum);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      resetSearch();
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

      setFeed((prev) => prev.filter((u) => u._id !== userId));
      setSearchResults((prev) => prev.filter((u) => u._id !== userId));
      setActionMessage("");
    } catch (err) {
      const msg = err.response?.data?.message;
      console.error("Action error", err);
      setActionMessage(msg || "An error occurred");

      if (msg === "connection request already exists!!") {
        setFeed((prev) => prev.filter((u) => u._id !== userId));
        setSearchResults((prev) => prev.filter((u) => u._id !== userId));
      }

      setTimeout(() => setActionMessage(""), 3000);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchMode(false);
    setActionMessage("");
  };

  const loadMore = () => {
    getFeed(page + 1, true);
  };

  const usersToDisplay = isSearchMode ? searchResults : feed;

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4 text-center">
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

        <button
          className={`btn ${
            isSearchMode ? "btn-secondary" : "btn-outline"
          } btn-sm mt-1 mb-4`}
          onClick={resetSearch}
        >
          Back to Feed
        </button>

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
          {isSearchMode ? (
            <p className="text-gray-500">
              Try searching with a different name.
            </p>
          ) : (
            <p className="text-gray-500">
              Check back later for new connections.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 p-4">
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {usersToDisplay.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onAction={handleConnectionAction}
              />
            ))}
          </div>
          {isLoading && (
            <div className="text-center py-4">
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
          {!isSearchMode && hasMore && !isLoading && (
            <button className="btn btn-outline mt-4" onClick={loadMore}>
              Load More
            </button>
          )}
          {!hasMore && !isSearchMode && (
            <div className="text-gray-500 text-sm mt-2">
              No more users to load.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Feed;
