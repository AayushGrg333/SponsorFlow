"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatPage;
var react_1 = require("react");
var socket_io_client_1 = require("socket.io-client");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var socket;
function ChatPage(_a) {
    var userId = _a.userId, userType = _a.userType;
    var _b = (0, react_1.useState)([]), chats = _b[0], setChats = _b[1];
    var _c = (0, react_1.useState)(null), selectedChat = _c[0], setSelectedChat = _c[1];
    var _d = (0, react_1.useState)([]), messages = _d[0], setMessages = _d[1];
    var _e = (0, react_1.useState)(""), message = _e[0], setMessage = _e[1];
    var _f = (0, react_1.useState)(null), receiverId = _f[0], setReceiverId = _f[1];
    var _g = (0, react_1.useState)(null), receiverType = _g[0], setReceiverType = _g[1];
    (0, react_1.useEffect)(function () {
        var _a;
        var token = (_a = document.cookie
            .split("; ")
            .find(function (row) { return row.startsWith("token="); })) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        socket = (0, socket_io_client_1.io)("http://localhost:8000", {
            transports: ["websocket"],
            auth: { token: token },
        });
        socket.on("receive_message", function (data) {
            var newMessages = Array.isArray(data) ? data : [data];
            // Only add messages to current chat
            if (selectedChat && newMessages[0].conversationId === selectedChat.conversationId) {
                setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), newMessages, true); });
            }
            // Update chats list last message
            var updatedChats = chats.map(function (c) {
                return c.conversationId === newMessages[0].conversationId
                    ? __assign(__assign({}, c), { lastMessage: newMessages[0].content }) : c;
            });
            setChats(updatedChats);
        });
        // Example: load chat list from backend
        fetch("http://localhost:8000/api/conversations") // replace with your API
            .then(function (res) { return res.json(); })
            .then(function (data) { return setChats(data); });
        return function () {
            socket.disconnect();
        };
    }, [selectedChat]);
    var selectChat = function (chat) {
        setSelectedChat(chat);
        setReceiverId(chat.conversationId); // here you may want to map to actual receiverId
        setReceiverType(chat.name.includes("Company") ? "company" : "influencer"); // simple example
        // load messages for that conversation
        fetch("http://localhost:8000/api/messages/".concat(chat.conversationId))
            .then(function (res) { return res.json(); })
            .then(function (data) { return setMessages(data); });
    };
    var sendMessage = function () {
        if (!message.trim() || !receiverId || !receiverType)
            return;
        socket.emit("send_message", {
            senderId: userId,
            senderType: userType,
            receiverId: receiverId,
            receiverType: receiverType,
            content: message,
        });
        setMessage("");
    };
    return (<div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r overflow-y-auto bg-gray-100">
        <h2 className="p-4 text-lg font-bold">Chats</h2>
        {chats.map(function (chat) { return (<div key={chat.conversationId} className={"p-4 cursor-pointer hover:bg-gray-200 ".concat((selectedChat === null || selectedChat === void 0 ? void 0 : selectedChat.conversationId) === chat.conversationId ? "bg-gray-300" : "")} onClick={function () { return selectChat(chat); }}>
            <div className="font-semibold">{chat.name}</div>
            <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
          </div>); })}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {selectedChat ? (messages.map(function (msg, i) { return (<div key={i} className={"p-2 my-1 max-w-xs rounded shadow-sm ".concat(msg.senderId === userId ? "bg-blue-200 self-end" : "bg-white self-start")}>
                {msg.content}
              </div>); })) : (<div className="text-gray-400">Select a chat to start messaging</div>)}
        </div>

        {selectedChat && (<div className="p-4 flex border-t bg-gray-100">
            <input_1.Input placeholder="Type a message..." value={message} onChange={function (e) { return setMessage(e.target.value); }} onKeyDown={function (e) { return e.key === "Enter" && sendMessage(); }}/>
            <button_1.Button className="ml-2" onClick={sendMessage}>
              Send
            </button_1.Button>
          </div>)}
      </div>
    </div>);
}
