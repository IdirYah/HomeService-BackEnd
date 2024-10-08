import { Types } from "mongoose"
import { IDemande } from "./demande"

export interface IRDV{
    idDemande:Types.ObjectId | IDemande;
    isCompleted:boolean;
}