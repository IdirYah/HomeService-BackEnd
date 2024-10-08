import mongoose from "mongoose"

const URL = process.env.MONGO_URL as string

if(!URL){
    throw new Error(
        "Connection URL is not defined in .env"
    )
}

export const connectDB = ()=>{
    mongoose.connect(URL)
    .then(()=>{
        console.log("Connectetd to MongoDB")
    }).catch((error)=>{
        console.log("Error connecting to MongDB",error)
    })
}