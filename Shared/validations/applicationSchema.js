"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSchema = void 0;
const zod_1 = require("zod");
exports.applicationSchema = zod_1.z.object({
    message: zod_1.z.string().max(500).optional(),
});
