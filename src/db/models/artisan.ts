import { Schema,Document,model } from "mongoose"
import { IArtisan } from "../types/artisan"
import { membreSchema } from "./membre"

interface IArtisanModel extends IArtisan,Document{}

const prestationSchema = new Schema({
    nomPrestation:{type:String,required:true},
    prixMin:{type:Number,required:true},
    prixMax:{type:Number,required:true},
})

const artisanSchema = new Schema<IArtisanModel>({
    ...membreSchema,
    domaine:{type:String,required:true},
    isActive:{type:Boolean,required:true,default:true},
    rating:{type:Number,required:true,default:5},
    tablePrestation:[{
        type:[prestationSchema],default:[],
    }]
})

export default model<IArtisanModel>("Artisan",artisanSchema)