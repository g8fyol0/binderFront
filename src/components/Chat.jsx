import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Helper function to format timestamp (you can customize this)
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true); // Correctly used now
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for the scroll target
  const chatContainerRef = useRef(null); // Ref for the scrollable container

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    // Alternative if you prefer to scroll a specific element into view:
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Trigger scroll whenever messages array changes

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!targetUserId) {
        setLoadingHistory(false);
        return;
      }
      setLoadingHistory(true);
      try {
        const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        
        if (response.data && Array.isArray(response.data.messages)) {
          const chatMessages = response.data.messages.map((msg) => ({
            // Ensure your backend sends senderId as an object with _id, firstName, lastName
            // or adjust this mapping accordingly.
            // If msg.senderId is just the ID string, then you'd use msg.senderId directly
            // and fetch/map firstName/lastName differently if needed for historical messages.
            // For consistency with live messages, it's best if historical messages also provide firstName/lastName.
            senderId: msg.senderId?._id || msg.senderId, // IMPORTANT: Get the actual ID string
            firstName: msg.senderId?.firstName, // Assuming senderId is populated with user details
            lastName: msg.senderId?.lastName,   // Assuming senderId is populated with user details
            text: msg.text,
            timestamp: msg.createdAt || msg.timestamp, // Use createdAt if available (Mongoose default), else timestamp
            _id: msg._id // Include message ID for a stable key
          }));
          setMessages(chatMessages);
        } else {
          setMessages([]); // Set to empty if no messages or unexpected format
        }
      } catch (err) {
        console.error("Failed to fetch chat messages:", err);
        setMessages([]); // Clear messages on error or handle appropriately
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchChatMessages();
  }, [targetUserId]); // Depend on targetUserId to refetch if it changes

  useEffect(() => {
    if (!userId || !user || !user.firstName) {
      return;
    }

    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }
    const socket = socketRef.current;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    // Destructure all expected properties, including senderId and timestamp
    const handleMessageReceived = ({
      firstName,
      lastName,
      text,
      senderId, // This is the sender's ID string
      timestamp,
      _id // Assuming backend sends _id for new messages too for consistency
    }) => {
      // Only add received messages if they are from OTHER users
      if (senderId !== userId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { _id, firstName, lastName, text, senderId, timestamp }, // Add _id here too
        ]);
      }
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
      // Consider disconnecting if the component is truly unmounting
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      //   socketRef.current = null;
      // }
    };
  }, [userId, targetUserId, user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !user || !user.firstName)
      return;

    const socket = socketRef.current;
    // Create a temporary _id for optimistic update, backend should provide the real one
    const tempId = `temp_${Date.now()}`;
    const messageData = {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    };

    socket.emit("sendMessage", messageData);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        _id: tempId, // Use temporary ID
        firstName: user.firstName,
        lastName: user.lastName,
        text: newMessage,
        senderId: userId,
        timestamp: new Date().toISOString(),
      },
    ]);
    // scrollToBottom(); // Already handled by the messages dependency effect
    setNewMessage("");
  };

  if (!user) {
    // Consider a more robust loading state for user data if it's fetched asynchronously elsewhere
    return <div className="flex justify-center items-center h-screen bg-gray-800 text-white">Loading user data...</div>;
  }

  // This loading state is now correctly managed
  if (loadingHistory) {
    return <div className="flex justify-center items-center h-screen bg-gray-800 text-white">Loading chat history...</div>;
  }

  return (
    <div className="w-3/4 mx-auto border-gray-600 m-5 h-[calc(100vh-10rem)] flex flex-col bg-gray-800 text-white">
      <h1 className="p-5 border-b border-gray-600 text-xl font-semibold">
        Chat
      </h1>
      {/* Add ref to the scrollable messages container */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && !loadingHistory && (
          <div className="text-center text-gray-400">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => {
          const isSentByMe = msg.senderId === userId;
          return (
            <div
              key={msg._id || msg.timestamp}
              className={`chat ${isSentByMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header mb-1">
                {msg.firstName}
                {msg.lastName ? ` ${msg.lastName}` : ""}{" "}
                <time className="text-xs opacity-50 ml-2">
                  {formatTimestamp(msg.timestamp)} 
                </time>
              </div>
              <div
                className={`chat-bubble ${isSentByMe ? "bg-blue-500" : "bg-gray-700"}`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {/* Optional: Empty div at the end to scroll to, if preferred over scrolling the container */}
        {/* <div ref={messagesEndRef} /> */}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded p-3 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded transition duration-150 ease-in-out"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
