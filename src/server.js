import dotenv from "dotenv"
dotenv.config();
import { connectDB } from "./config/dbConnect.js"
import app from "./app.js";



connectDB();

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    
})