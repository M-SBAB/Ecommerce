import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

import UserRoutes from "./routes/user.js"
import ProductRoutes from "./routes/products.js"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

app.use("/auth", UserRoutes)
app.use("/products",ProductRoutes)


const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
        app.listen(PORT, ()=>console.log(`Server Connected on PORT ${PORT}`))
}).catch(()=>{
    console.log("Server didnt connect")
})