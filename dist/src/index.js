"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = require("swagger-ui-express");
const swagger_config_1 = __importDefault(require("./../swagger.config"));
const routes_1 = __importDefault(require("./app/routes"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(routes_1.default);
app.get('', (req, res) => {
    res.send('api works');
});
const swaggerDocs = (0, swagger_jsdoc_1.default)(swagger_config_1.default);
app.use('/swagger', swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swaggerDocs));
app.listen(port, () => {
    console.log(`api running on port ${port}`);
});
