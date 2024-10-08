import express from "express"
import { loginArtisan, loginClient, registerArtisan, registerClient } from "../controllers/authController"

const routes = express.Router()

routes.post("/registerClient",registerClient)
routes.post("/loginClient",loginClient)
routes.post("/registerArtisan",registerArtisan)
routes.post("/loginArtisan",loginArtisan)

export default routes