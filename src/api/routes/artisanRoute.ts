import express from "express";
import { updateArtisan,updatePassword,addPrestation,getDemande } from "../controllers/artisanController";
import authArtisan from "../middleware/authArtisan"

const artisanRoutes = express.Router()

artisanRoutes.put("/updateArtisan",authArtisan,updateArtisan)
artisanRoutes.put("/updateArtisanPassword",authArtisan,updatePassword)
artisanRoutes.put("/addPrestation",authArtisan,addPrestation)
artisanRoutes.get("/getDemande",authArtisan,getDemande)

export default artisanRoutes