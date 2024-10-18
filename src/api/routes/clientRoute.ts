import express from "express"
import { getArtisan,updateClient,updatePassword,addDemande } from "../controllers/clientController"
import authClient from "../middleware/authClient"

const clientRoutes = express.Router()

clientRoutes.get("/getArtisan",authClient,getArtisan)
clientRoutes.put("/updateClient",authClient,updateClient)
clientRoutes.put("/updateClientPassword",authClient,updatePassword)
clientRoutes.post("/addDemande",authClient,addDemande)

export default clientRoutes