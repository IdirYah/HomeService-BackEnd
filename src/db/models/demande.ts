import {Schema,model,Document} from "mongoose"
import { IDemande } from "../types/demande"

interface IDemandeModel extends IDemande,Document{}

const demandeSchema = new Schema<IDemandeModel>({
    idClient:{type:Schema.Types.ObjectId,ref:"Client",required:true},
    idArtisan:{type:Schema.Types.ObjectId,ref:"Artisan",required:true},
    description:{type:String,required:true},
    titre:{type:String,required:true},
    annulation:{type:Boolean,required:true,default:false},
    isConfirmed:{type:Boolean,required:true,default:false},
    isUrgent:{type:Boolean,required:true,default:false},
    isCompleted:{type:Boolean,required:true,default:false},
    date:{type:Date,required:true},
})

export default model<IDemandeModel>("Demande",demandeSchema)