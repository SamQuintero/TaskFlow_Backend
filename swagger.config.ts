
import { SwaggerOptions }  from "swagger-ui-express"

const port = process.env.PORT || 3001;

const SwaggerOptions : SwaggerOptions = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            title: "API Dummy",
            version: "0.0.1",
            description: "API just to learn",
        },
        servers: [
            {
                url: 'http://localhost:' + port + "/"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis :[
        './src/**/*.ts'
    ]
}

export default SwaggerOptions;
