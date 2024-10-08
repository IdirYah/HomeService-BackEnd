import { model,Schema,Document } from "mongoose"
import { IEvaluation } from "../types/evaluation"

interface IEvaluationModel extends IEvaluation,Document{}

const evaluationSchema = new Schema<IEvaluationModel>({
    idRDV:{type:Schema.Types.ObjectId,ref:"RDV",required:true},
    rating:{type:Number,required:true},
    comment:{type:String,default:""}
})

export default model<IEvaluationModel>("Evaluation",evaluationSchema)