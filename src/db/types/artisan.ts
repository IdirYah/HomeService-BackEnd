import { Types } from "mongoose"
import { IMembre } from "./membre"
import { IPrestation } from "./prestation"

export interface IArtisan extends IMembre{
    domaine:string;
    isActive:boolean;
    rating:number;
    tablePrestation:Types.ObjectId[] | IPrestation[];
}