"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
var socket_io_client_1 = require("socket.io-client");
var socket;
var connectSocket = function () {
    if (!socket) {
        socket = (0, socket_io_client_1.io)("http://localhost:8000"); // backend URL
    }
    return socket;
};
exports.connectSocket = connectSocket;
