"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const task_1 = __importDefault(require("./task"));
const goal_1 = __importDefault(require("./goal"));
const calendar_1 = __importDefault(require("./calendar"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/user", users_1.default);
router.use("/tasks", task_1.default);
router.use("/goals", goal_1.default);
router.use("/calendar", calendar_1.default);
exports.default = router;
