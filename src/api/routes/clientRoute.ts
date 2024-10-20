import express from "express"
import { getArtisan,updateClient,updatePassword,addDemande,annulerDemande } from "../controllers/clientController"
import authClient from "../middleware/authClient"

const clientRoutes = express.Router()

clientRoutes.get("/getArtisan",authClient,getArtisan)
clientRoutes.put("/updateClient",authClient,updateClient)
clientRoutes.put("/updateClientPassword",authClient,updatePassword)
clientRoutes.post("/addDemande",authClient,addDemande)
clientRoutes.put("/annulerDemande",authClient,annulerDemande)

export default clientRoutes