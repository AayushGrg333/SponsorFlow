"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

let socket: Socket;

export default function ChatPage() {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Connect to your backend Socket.IO server
    socket = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.on("welcome", (data: string) => {
      setWelcomeMessage(data);
    });
    // Listen for incoming messages
socket.on("from_server", (data: { from: string; message: string }) => {
  setMessages((prev) => [...prev, `${data.from}: ${data.message}`]);
});


    return () => {
      socket.disconnect();
    };
  }, []);

const sendMessage = () => {
  if (!message.trim()) return;
  socket.emit("chat:message", message);
  setMessage("");
};


  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-50">
      {welcomeMessage && (
        <div className="p-2 my-1 rounded bg-blue-100 text-blue-800 shadow-sm">
          {welcomeMessage}
        </div>
      )}
        {messages.map((msg, i) => (
          <div key={i} className="p-2 my-1 rounded bg-white shadow-sm">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex mt-3">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button className="ml-2" onClick={sendMessage}>
          Sendyou
        </Button>
      </div>
    </div>
  );
}
