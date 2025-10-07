"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = require("../middelwares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddelware);
router.get('', auth_1.authMiddelware, users_1.getUsers);
exports.default = router;
