import express from "express"
import { getArtisan,updateClient,updatePassword } from "../controllers/clientController"
import authClient from "../middleware/authClient"

const clientRoutes = express.Router()

clientRoutes.get("/getArtisan",authClient,getArtisan)
clientRoutes.put("/updateClient",authClient,updateClient)
clientRoutes.put("/updateClientPassword",authClient,updatePassword)

export default clientRoutes