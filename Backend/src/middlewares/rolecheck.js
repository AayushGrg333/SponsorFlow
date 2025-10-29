"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkRole(role) {
    return function (req, res, next) {
        try {
            var user = req.user;
            if (!user || user.role !== role) {
                res.status(403).json({
                    success: false,
                    message: "Only ".concat(role, "s are allowed to access this route."),
                });
                return;
            }
            return next();
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error checking role",
            });
            return;
        }
    };
}
exports.default = checkRole;
