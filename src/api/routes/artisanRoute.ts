import express from "express";
import { updateArtisan,updatePassword } from "../controllers/artisanController";
import authArtisan from "../middleware/authArtisan"

const artisanRoutes = express.Router()

artisanRoutes.put("/updateArtisan",authArtisan,updateArtisan)
artisanRoutes.put("/updateArtisanPassword",authArtisan,updatePassword)

export default artisanRoutes