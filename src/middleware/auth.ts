import type { NextFunction, Request, Response } from "express";
import { Result } from "pg";

const auth = ()=>{
    return async (req : Request, res : Response, next : NextFunction)=>{
    // console.log("this is protected route");
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;

    if(!token){
        res.status(401).json({
            success : false,
            message : "Unauthorized access!!!",
            
        });
    }
    next();

};
}

export default auth

