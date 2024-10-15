import { Request,Response } from "express";
import { StatusCodes } from "http-status-codes";
import Artisan from "../../db/models/artisan";

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