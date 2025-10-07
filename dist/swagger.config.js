"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const port = process.env.PORT;
const options = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            title: "API Dummy",
            version: "0.0.1",
            description: "API just to learn",
        },
        servers: [
            {
                url: "https:localhost:" + port + "/"
            }
        ]
    },
    apis: [
        './src/**/*.ts'
    ]
};
exports.default = options;
