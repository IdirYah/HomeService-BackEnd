import express from "express"
import { loginArtisan, loginClient, registerArtisan, registerClient } from "../controllers/authController"

const authRoutes = express.Router()

authRoutes.post("/registerClient",registerClient)
authRoutes.post("/loginClient",loginClient)
authRoutes.post("/registerArtisan",registerArtisan)
authRoutes.post("/loginArtisan",loginArtisan)

export default authRoutes