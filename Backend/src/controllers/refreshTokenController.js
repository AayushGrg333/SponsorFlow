"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var jsonwebtoken_1 = require("jsonwebtoken");
var refreshTokenController = function (req, res) {
    var token = req.cookies.refreshToken;
    if (!token)
        res.status(401).json({ message: "refresh token not found" });
    var accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    var refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    jsonwebtoken_1.default.verify(token, refreshTokenSecret, function (err, decoded) {
        if (err)
            return res.status(403).json({ message: "Invalid refresh token" });
        var id = decoded.id, usertype = decoded.usertype;
        var newAccessToken = jsonwebtoken_1.default.sign({ id: id, usertype: usertype }, accessTokenSecret, {
            expiresIn: "15m"
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.json({ success: true, message: "new access token has been assigned" });
    });
};
exports.default = refreshTokenController;
