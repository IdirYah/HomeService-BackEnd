import { Schema,Document,model } from "mongoose"
import { IClient } from "../types/client"
import { membreSchema } from "./membre"

interface IClientModel extends IClient,Document{}

const clientSchema = new Schema<IClientModel>({
    ...membreSchema,
})

export default model<IClientModel>("Client",clientSchema)