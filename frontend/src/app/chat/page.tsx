"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Chat {
  conversationId: string;
  name: string;
  lastMessage: string;
}

interface Message {
  senderId: string;
  content: string;
  createdAt: string;
}

let socket: Socket;

export default function ChatPage({ userId, userType }: { userId: string; userType: string }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverType, setReceiverType] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    socket = io("http://localhost:8000", {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("receive_message", (data: any) => {
      const newMessages = Array.isArray(data) ? data : [data];

      // Only add messages to current chat
      if (selectedChat && newMessages[0].conversationId === selectedChat.conversationId) {
        setMessages((prev) => [...prev, ...newMessages]);
      }

      // Update chats list last message
      const updatedChats = chats.map((c) =>
        c.conversationId === newMessages[0].conversationId
          ? { ...c, lastMessage: newMessages[0].content }
          : c
      );
      setChats(updatedChats);
    });

    // Example: load chat list from backend
    fetch("http://localhost:8000/api/conversations") // replace with your API
      .then((res) => res.json())
      .then((data) => setChats(data));

    return () => {
      socket.disconnect();
    };
  }, [selectedChat]);

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setReceiverId(chat.conversationId); // here you may want to map to actual receiverId
    setReceiverType(chat.name.includes("Company") ? "company" : "influencer"); // simple example

    // load messages for that conversation
    fetch(`http://localhost:8000/api/messages/${chat.conversationId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  const sendMessage = () => {
    if (!message.trim() || !receiverId || !receiverType) return;

    socket.emit("send_message", {
      senderId: userId,
      senderType: userType,
      receiverId,
      receiverType,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r overflow-y-auto bg-gray-100">
        <h2 className="p-4 text-lg font-bold">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.conversationId}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              selectedChat?.conversationId === chat.conversationId ? "bg-gray-300" : ""
            }`}
            onClick={() => selectChat(chat)}
          >
            <div className="font-semibold">{chat.name}</div>
            <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {selectedChat ? (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 my-1 max-w-xs rounded shadow-sm ${
                  msg.senderId === userId ? "bg-blue-200 self-end" : "bg-white self-start"
                }`}
              >
                {msg.content}
              </div>
            ))
          ) : (
            <div className="text-gray-400">Select a chat to start messaging</div>
          )}
        </div>

        {selectedChat && (
          <div className="p-4 flex border-t bg-gray-100">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button className="ml-2" onClick={sendMessage}>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
