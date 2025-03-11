import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, connectSocket, socket } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) connectSocket();

    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages, socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-br from-green-50 to-green-200">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-end gap-2 max-w-[75%]">
              {/* Profile Picture */}
              {message.senderId !== authUser._id && (
                <div className="w-8 h-8 rounded-full border overflow-hidden">
                  <img src={selectedUser?.avatar || "/user.jpg"} alt="profile pic" />
                </div>
              )}

              {/* Chat Bubble */}
              <div className={`p-3 rounded-lg shadow-md ${message.senderId === authUser._id ? "bg-green-500 text-white" : "bg-white text-gray-800 border"}`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p className="break-words">{message.text}</p>}
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {formatMessageTime(new Date(message.createdAt))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
