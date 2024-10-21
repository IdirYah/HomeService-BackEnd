import { Types } from "mongoose"
import { IClient } from "./client"
import { IArtisan } from "./artisan"

export interface IDemande{
    idClient:Types.ObjectId | IClient;
    idArtisan:Types.ObjectId | IArtisan;
    description:string;
    titre:string;
    annulation:boolean;
    isConfirmed:boolean;
    isUrgent:boolean;
    isCompleted:boolean;
    date:Date;
}