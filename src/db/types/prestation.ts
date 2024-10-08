import { Types } from "mongoose"

export interface IPrestation{
    nomPrestation:string;
    domaine:string;
    prixMin:number;
    prixMax:number;
}