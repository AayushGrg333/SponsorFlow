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
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.notfoundHandler = exports.errorHandler = void 0;
var winston_1 = require("winston");
var AppError_1 = require("../utils/AppError");
var logger = winston_1.default.createLogger({
    level: "error",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({
            filename: "error.log",
            level: "error",
        }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
    ],
});
var errorHandler = function (err, req, res, next) {
    // Log the error details
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString(),
    });
    // Handle known application errors
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            timestamp: err.timestamp,
            path: req.path
        });
        return;
    }
    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }
    //handle mongoose jwt error
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
        return;
    }
    //handle mongoose duplicate key error
    if (err.code === 11000) {
        res.status(409).json({
            status: 'error',
            message: 'Duplicate field value entered'
        });
        return;
    }
    //handle other errors
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
    return;
};
exports.errorHandler = errorHandler;
//404 handler
var notfoundHandler = function (req, res, next) {
    res.status(404).json({
        status: 'error',
        message: "Route ".concat(req.originalUrl, " not found")
    });
};
exports.notfoundHandler = notfoundHandler;
exports.log = {
    info: function (message, meta) {
        logger.info(message, meta);
    },
    error: function (message, error, meta) {
        logger.error(message, __assign({ error: (error === null || error === void 0 ? void 0 : error.message) || error, stack: error === null || error === void 0 ? void 0 : error.stack }, meta));
    },
    warn: function (message, meta) {
        logger.warn(message, meta);
    },
    debug: function (message, meta) {
        logger.debug(message, meta);
    }
};
