import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser =  async(req : Request, res : Response)=>{
// const {name, email, password, age}= req.body;

try {
 const result = await userService.createUserIntoDB(req.body);
//   console.log(result);

res.status(201).json({
    success :  true,
    message : "User Created successfully!",
    data : result.rows[0],
  });
} catch (error : any) {
  res.status(500).json({
    success :  false,
    message : error.message,
    data : error,
  });
}
};

const getAllUsers = async(req : Request,res : Response)=>{
  console.log("Controller",req.user);
  try {
   const result = await userService.getAllUsersFromDB();
      res.status(200).json({
        success :  true,
        messagse : "Users retrived successfully!",
        data :  result.rows,
      })
  } catch (error : any) {
    res.status(500).json({
        success :  false,
        messagse : error.message,
        data :  error,
    });
  }
};

const getSingleUser = async(req : Request, res : Response)=>{
    const {id} = req.params;
    try {
     const result = await userService.getSingleUserFromDB(id as string);

        if(result.rows.length ===0){
           res.status(404).json({
        success :  false,
        messagse : "User not found!",
        data :  {},
      });
        }
        
        res.status(200).json({
        success :  true,
        messagse : "User retrived successfully!",
        data :  result.rows[0],
      })
    } catch (error : any) {
      res.status(500).json({
        success :  false,
        messagse : error.message,
        data :  error,
    });
    }
};


const updateUser = async(req :  Request, res : Response)=>{
  const {id} = req.params;
  try {
   const result = await userService.updateUserFromDB(req.body, id as string)


  if(result.rows.length===0){
    res.status(404).json({
      success : false,
      message : "User not found!", 
    });
  }

  res.status(200).json({
        success :  true,
        messagse : "User Updated successfully!",
        data :  result.rows[0],
  });
  } catch (error : any) {
     res.status(500).json({
        success :  false,
        messagse : error.message,
        data :  error,
    });
  }
};

const deleteUser = async(req : Request, res : Response)=>{
  const {id} = req.params;
  try {
   const result = await userService.deleteUserFromDB(id as string);

    if(result.rowCount === 0){
       res.status(404).json({
      success : false,
      message : "User not found!",
    });
    }

     res.status(200).json({
        success :  true,
        messagse : "User deleted successfully!",
  });
    
  } catch (error : any) {
     res.status(500).json({
        success :  false,
        messagse : error.message,
        data :  error,
     });
  }
}

export const userController = { 
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};