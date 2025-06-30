import express from 'express';
import cors from 'cors';

const app = express()

app.use(express.json());
app.use(express.urlencoded());

//routes import
import userRoute from "./routes/user.routes.js"

//route declare
app.use("/api/v1/users/",userRoute)


export default app