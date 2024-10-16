import { Request,Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import Artisan from "../../db/models/artisan";
import Client from "../../db/models/client"

export const getArtisan = async(req:Request,res:Response):Promise<any>=>{
    try{
        const {domaine} = req.body
        if(!domaine){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Please provide a domaine"})
        }
        const artisans = await Artisan.find({domaine})
        if(artisans.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No artisans found in this domain"})
        }
        res.status(StatusCodes.OK).json(artisans)
    }catch(error) {
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const updateClient = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {nom,prenom,tel,adresse,email} = req.body
        const idClient:string = req.user?.idClient as string
        if(!idClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const idClientObjet = new mongoose.Types.ObjectId(idClient)
        const oldClient = await Client.findById(idClientObjet,)
        if(!oldClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        oldClient.nom = nom || oldClient.nom
        oldClient.prenom = prenom || oldClient.prenom
        oldClient.tel = tel || oldClient.tel
        oldClient.adresse = adresse || oldClient.adresse
        oldClient.email = email || oldClient.email
        await oldClient.save()
        res.status(StatusCodes.OK).json({message:"Client updated successfully"})
    } catch (error) {
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})   
    }
}

export const updatePassword = async(req:Request,res:Response):Promise<any>=>{
    try{
        
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}