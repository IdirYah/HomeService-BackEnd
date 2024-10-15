import express from "express"
import { getArtisan } from "../controllers/clientController"
import authClient from "../middleware/authClient"

const clientRoutes = express.Router()

clientRoutes.get("/getArtisan",authClient,getArtisan)

export default clientRoutes