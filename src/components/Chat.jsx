import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

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
  const [loadingHistory, setLoadingHistory] = useState(true);
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!targetUserId) return setLoadingHistory(false);
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        if (res.data?.messages?.length) {
          const formatted = res.data.messages.map((msg) => ({
            senderId: msg.senderId?._id || msg.senderId,
            firstName: msg.senderId?.firstName,
            lastName: msg.senderId?.lastName,
            text: msg.text,
            timestamp: msg.createdAt || msg.timestamp,
            _id: msg._id,
          }));
          setMessages(formatted);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !user?.firstName) return;

    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }

    const socket = socketRef.current;
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    const handleMessageReceived = ({
      firstName,
      lastName,
      text,
      senderId,
      timestamp,
      _id,
    }) => {
      if (senderId !== userId) {
        setMessages((prev) => [
          ...prev,
          { _id, firstName, lastName, text, senderId, timestamp },
        ]);
      }
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [userId, targetUserId, user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !user?.firstName) return;

    const socket = socketRef.current;
    const tempId = `temp_${Date.now()}`;
    const messageData = {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    };

    socket.emit("sendMessage", messageData);

    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        firstName: user.firstName,
        lastName: user.lastName,
        text: newMessage,
        senderId: userId,
        timestamp: new Date().toISOString(),
      },
    ]);

    setNewMessage("");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading user data...
      </div>
    );
  }

  if (loadingHistory) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading chat history...
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4 mx-auto my-6 h-[calc(100vh-8rem)] flex flex-col rounded-xl bg-gray-900 shadow-lg overflow-hidden">
      <header className="p-5 border-b border-gray-700 text-xl font-semibold text-white bg-gray-800">
        💬 Chat
      </header>

      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div
                key={msg._id}
                className={`flex flex-col max-w-md ${
                  isMe ? "ml-auto items-end" : "items-start"
                }`}
              >
                <div className="text-sm text-gray-400 mb-1">
                  {msg.firstName} {msg.lastName} ·{" "}
                  <span className="text-xs">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
                <div
                  className={`rounded-xl px-4 py-2 shadow-md text-white text-sm ${
                    isMe ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </main>

      <footer className="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-lg transition"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
