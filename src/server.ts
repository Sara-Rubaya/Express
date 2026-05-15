import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg";
const app : Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_k1eSNmQUzW4C@ep-dawn-rice-apw0prz6-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async()=>{
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      
      )
      `)
      console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req : Request, res : Response) => {
//   res.send('Hello World!')
  res.status(200).json({
    message: "Express Server",
    "author" : "Next Level",
  });
});

app.post("/api/users", async(req : Request, res : Response)=>{
// console.log(req.body);
const {name, email, password, age}= req.body;

try {
  const result = await pool.query(
  `
  INSERT INTO users(name,email,password,age)VALUES($1,$2,$3,$4) RETURNING *
  `,
  [name, email, password, age],
);
  console.log(result);

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
});

app.get("/api/users", async(req : Request,res : Response)=>{
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)
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
});

app.get("/api/users/:id",async(req : Request, res : Response)=>{
    const {id} = req.params;
    try {
      const result = await pool.query(`
        SELECT * FROM users WHERE id=$1 
        `,[id],);

        if(result.rows.length ===0){
           res.status(500).json({
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
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
