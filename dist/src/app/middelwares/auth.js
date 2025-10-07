"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddelware = authMiddelware;
function authMiddelware(req, res, next) {
    const token = req.query.token;
    if (token == '12345') {
        req.user = { name: 'sam', id: 123, email: 'sam@correo.com' };
        next();
    }
    else {
        res.status(401).send({ message: "unauthorized" });
        //res.sendStatus(401);
    }
}
