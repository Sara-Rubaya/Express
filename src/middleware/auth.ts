import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";



const auth = (...roles : ROLES[])=>{

   
    return async (req : Request, res : Response, next : NextFunction)=>{
        //  console.log(roles);
   try {
     // console.log("this is protected route");
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;

    // console.log(token);

    if(!token){
        res.status(401).json({
            success : false,
            message : "Unauthorized access!!!",
            
        });
    }

    const decoded = jwt.verify(token as string,config.secret as string) as JwtPayload;
    
    const userData = await pool.query(`
       SELECT * FROM users WHERE email=$1 
        `,[decoded.email],
    );
    // console.log(userData);
    const user = userData.rows[0];
    // console.log(user);
    if(userData.rows.length === 0){
      res.status(404).json({
            success : false,
            message : "user not found!!!",
            
        });
    }


    if(!user?.is_active){
       res.status(403).json({
            success : false,
            message : "Forbidden!!!",
            
        });
    }

    // console.log("Auth role : ",user.role);

    //roles = ["admin", "agent"]
    //user.role = "admin" | "user", | "agent"
    if( roles.length && !roles.includes(user.role)){
       res.status(403).json({
            success : false,
            message : "Access denied. No valid role found.",
            
        });
    }

    req.user = decoded   //req : {user : {} }

    next();
   } catch (error) {
    next(error);
    
   }

};
}

export default auth

