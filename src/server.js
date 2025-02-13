import dotenv from "dotenv"
import connectDB from "./db/index.db.js";
import { app } from "./app.js";

dotenv.config(
    {
        path:'./env'
    }
)

connectDB().then(()=>{
    const port = process.env.PORT || 5000;
    app.listen(port,()=>{
        console.log(`✔ Server is running at port: ${port} and at DB: ${process.env.MONGODB_URI}`)
    })
}).catch((err)=>{
    console.log("❌ Server is not working ",err);
});