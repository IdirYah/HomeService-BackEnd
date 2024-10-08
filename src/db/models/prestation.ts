import { Schema,Document,model } from "mongoose"
import { IPrestation } from "../types/prestation"

interface IPrestationModel extends IPrestation,Document{}

const prestationSchema = new Schema<IPrestationModel>({
    domaine:{type:String,required:true},
    nomPrestation:{type:String,required:true},
    prixMin:{type:Number,required:true},
    prixMax:{type:Number,required:true},
})

export default model<IPrestationModel>("Prestation",prestationSchema)