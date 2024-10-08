import { Types } from "mongoose"
import { IRDV } from "./RDV"

export interface IEvaluation{
    idRDV:Types.ObjectId | IRDV;
    rating:number;
    comment?:string;
}