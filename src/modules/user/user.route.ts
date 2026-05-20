import { Router } from "express";
import { userController } from "./user.controller";


const router = Router()

// CREATE user

router.post("/",userController.createUser);

// GEt all users

router.get("/",userController.getAllUsers );

// GET single user/by id

router.get("/:id",userController.getSingleUser);

// UPDATE user by id

router.put("/:id",userController.updateUser );

// DELETE user by id

router.delete("/:id",userController.deleteUser );


export const userRoute = router