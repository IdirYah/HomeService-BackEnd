import { Types } from "mongoose"

export interface IMembre{
    nom:string;
    prenom:string;
    tel:string;
    adresse:string;
    email:string;
    mdp:string;
}