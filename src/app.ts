import express, {
   type Application,
    type Request,
     type Response
     } from "express";
import config from "./config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app : Application = express();



// Middleware

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));


// Connect to NEONDB


initDB();

app.get("/", (req : Request, res : Response) => {

  res.status(200).json({
    message: "Express Server",
    "author" : "Next Level",
  });
});

app.use("/api/users",userRoute);
app.use("/api/profile",profileRoute);
app.use("/api/auth",authRoute)

export default app
