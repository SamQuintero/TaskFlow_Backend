import express, { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import swaggerJsDoc from "swagger-jsdoc"
import { setup, serve} from "swagger-ui-express"
import swaggerOptions from "./../swagger.config";


import routes from "./app/routes";


const port = process.env.PORT || 3001; 

const app = express();
app.use(express.json());

app.use(routes);


app.get('', (req: Request, res: Response) =>{
    res.send('api works');
})

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', serve, setup(swaggerDocs));

app.listen(port, () => {
    console.log(`api running on port ${port}`);
})
