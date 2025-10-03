import { Request, Response } from "express";

export function getUsers(req: Request, res: Response){
    res.send({data: []})
}