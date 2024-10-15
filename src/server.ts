import express from "express"
import dotenv from 'dotenv'
dotenv.config()
import {connectDB} from "./db/connectDB"
import authRoutes from "./api/routes/authRoute"
import clientRoutes from "./api/routes/clientRoute"

const app = express()
const PORT = process.env.PORT || 6000

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes)
app.use('/api/client',clientRoutes)

app.listen(PORT,()=>{
    console.log(`Server runnig on port ${PORT}`)
})