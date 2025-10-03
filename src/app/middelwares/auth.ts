import { Request, Response , NextFunction } from "express";
import { IUser } from "../interfaces/user";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export function authMiddelware(req: Request, res: Response, next: NextFunction) {

    const token = req.query.token;
    if (token == '12345'){
        req.user = {name: 'sam', id:123, email :'sam@correo.com'}
        next();
    }
    else {
        res.status(401).send({message: "unauthorized"});
        //res.sendStatus(401);
    }
}