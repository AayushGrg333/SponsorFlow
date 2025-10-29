"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
function getEnvVar(key, required) {
    if (required === void 0) { required = true; }
    var value = process.env[key];
    if (!value) {
        throw new Error("Missing required env variable : ${key}");
    }
    return value;
}
exports.config = {
    PORT: getEnvVar("PORT"),
    MONGODB_URL: getEnvVar("MONGODB_URL"),
    RESEND_API_KEY: getEnvVar("RESEND_API_KEY"),
    JWT_SECRET_OR_KEY: getEnvVar("JWT_SECRET_OR_KEY"),
    JWT_REFRESH_SECRET: getEnvVar("JWT_REFRESH_SECRET"),
    JWT_ACCESS_SECRET: getEnvVar("JWT_ACCESS_SECRET"),
    GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnvVar("GOOGLE_CLIENT_SECRET"),
    REDIS_URL: getEnvVar("REDIS_URL"),
};
