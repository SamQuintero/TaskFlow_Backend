import express, { Request, Response } from "express";
import dotenv from "dotenv"
import { connectDB } from "./database";
import path from "path";
dotenv.config()
import swaggerJsDoc from "swagger-jsdoc"
import { setup, serve} from "swagger-ui-express"
import swaggerOptions from "./../swagger.config";


import routes from "./app/routes";


const port = process.env.PORT || 3001; 
const dbUrl = process.env.MONGO_URL;
const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "app/views"));

app.use(express.json());


app.use(routes);


app.get('', (req: Request, res: Response) =>{
    res.send('api works');
})

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', serve, setup(swaggerDocs));

connectDB().then(res => {
    console.log('Ya se conecto!');
    app.listen(port, () => {
        console.log(`App is running in port ${port}`);
    })
}).catch(err => {
    console.log('Ocurrio un error');
});


