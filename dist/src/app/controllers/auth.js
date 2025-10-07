"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.signup = signup;
function login(req, res) {
    console.log('Login body: ', req.body);
    res.send({ token: "jasfhj1234hk989778" });
}
function signup(req, res) {
    console.log('Signup body: ', req.body);
    res.send();
}
