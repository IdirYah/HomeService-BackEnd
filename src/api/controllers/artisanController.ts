import { Request,Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import Artisan from "../../db/models/artisan";

export const updateArtisan = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {nom,prenom,tel,adresse,email,isActive} = req.body
        const idArtisan:string = req.artisan?.idArtisan as string
        if(!idArtisan){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const idArtisanObjet = new mongoose.Types.ObjectId(idArtisan)
        const oldArtisan = await Artisan.findById(idArtisanObjet,)
        if(!oldArtisan){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        oldArtisan.nom = nom || oldArtisan.nom
        oldArtisan.prenom = prenom || oldArtisan.prenom
        oldArtisan.tel = tel || oldArtisan.tel
        oldArtisan.adresse = adresse || oldArtisan.adresse
        oldArtisan.email = email || oldArtisan.email
        oldArtisan.isActive = isActive || oldArtisan.isActive
        await oldArtisan.save()
        res.status(StatusCodes.OK).json({message:"Artisan updated successfully"})
    } catch (error) {
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const updatePassword = async(req:Request,res:Response):Promise<any>=>{
    try{
        const {oldPassword,newPassword,confirmPassword} = req.body
        const idArtisan:string = req.artisan?.idArtisan as string
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Please enter your credentials"})
        }
        if(!idArtisan){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const idArtisanObjet = new mongoose.Types.ObjectId(idArtisan)
        if(!idArtisanObjet){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const oldArtisan = await Artisan.findById(idArtisanObjet,)
        if(!oldArtisan){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const isMatch = await bcrypt.compare(oldPassword,oldArtisan.mdp)
        if(!isMatch){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid Password"})
        }
        if(newPassword !== confirmPassword){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Check the new pasword"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashMDP = await bcrypt.hash(newPassword,salt) as string 
        oldArtisan.mdp = hashMDP
        await oldArtisan.save()
        res.status(StatusCodes.OK).json({message:"Password updated successfully"})
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}