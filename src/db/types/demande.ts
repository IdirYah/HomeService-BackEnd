import { Types } from "mongoose"
import { IClient } from "./client"
import { IArtisan } from "./artisan"
import { IPrestation } from "./prestation"

export interface IDemande{
    idClient:Types.ObjectId | IClient;
    idArtisan:Types.ObjectId | IArtisan;
    description:string;
    prestation:Types.ObjectId | IPrestation;
    adresse:string;
    annulation:boolean;
    isConfirmed:boolean;
    isUrgent:boolean;
    date:string;
}