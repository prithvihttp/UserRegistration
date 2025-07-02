import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"))
app.use(cookieParser());


// routes import 
import userRoute from "./routes/user.routes.js"


// route declare
app.use("/api/v1/users/", userRoute);

export default app;