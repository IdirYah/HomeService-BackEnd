import express from "express"
import dotenv from 'dotenv'
dotenv.config()
import {connectDB} from "./db/connectDB"
import routes from "./api/routes/authRoute"

const app = express()
const PORT = process.env.PORT || 6000

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api',routes)

app.listen(PORT,()=>{
    console.log(`Server runnig on port ${PORT}`)
})