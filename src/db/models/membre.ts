export const membreSchema = {
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mdp:{type:String,required:true},
}