import { Schema,Document,model } from "mongoose"
import { IRDV } from "../types/RDV"

interface IRDVModel extends IRDV,Document{}

const RDVschema = new Schema<IRDVModel>({
    idDemande:{type:Schema.Types.ObjectId,ref:"Demande",required:true},
    isCompleted:{type:Boolean,required:true,default:false},
})

export default model<IRDVModel>("RDV",RDVschema)