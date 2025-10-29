"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apiresponse = void 0;
var Apiresponse = /** @class */ (function () {
    function Apiresponse() {
    }
    Apiresponse.success = function (res, message, data) {
        if (message === void 0) { message = "Success"; }
        if (data === void 0) { data = null; }
        return res.status(200).json({
            status: "success",
            message: message,
            data: data,
        });
    };
    Apiresponse.created = function (res, data, message) {
        if (data === void 0) { data = null; }
        if (message === void 0) { message = "Resource created successfully"; }
        return res.status(201).json({
            status: "success",
            message: message,
            data: data,
        });
    };
    Apiresponse.noContent = function (res) {
        return res.status(204).send();
    };
    Apiresponse.error = function (res, message, statusCode) {
        if (statusCode === void 0) { statusCode = 500; }
        return res.status(statusCode).json({
            status: "error",
            message: message,
        });
    };
    return Apiresponse;
}());
exports.Apiresponse = Apiresponse;
exports.default = Apiresponse;
