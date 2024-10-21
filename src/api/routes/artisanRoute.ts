import express from "express";
import { updateArtisan,updatePassword,addPrestation,getDemande,confirmDemande,getRDV,completedRDV } from "../controllers/artisanController";
import authArtisan from "../middleware/authArtisan"

const artisanRoutes = express.Router()

artisanRoutes.put("/updateArtisan",authArtisan,updateArtisan)
artisanRoutes.put("/updateArtisanPassword",authArtisan,updatePassword)
artisanRoutes.put("/addPrestation",authArtisan,addPrestation)
artisanRoutes.get("/getDemande",authArtisan,getDemande)
artisanRoutes.put("/confirmDemande",authArtisan,confirmDemande)
artisanRoutes.get("/getRDV",authArtisan,getRDV)
artisanRoutes.put("/completedRDV",authArtisan,completedRDV)

export default artisanRoutes