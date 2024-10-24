import { Request,Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import Artisan from "../../db/models/artisan";
import Client from "../../db/models/client";
import Demande from "../../db/models/demande";
import dayjs from "dayjs";
import bcrypt from "bcrypt"

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
        const {oldPassword,newPassword,confirmPassword} = req.body
        const idClient:string = req.user?.idClient as string
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Please enter your credentials"})
        }
        if(!idClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const idClientObjet = new mongoose.Types.ObjectId(idClient)
        const oldClient = await Client.findById(idClientObjet,)
        if(!oldClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const isMatch = await bcrypt.compare(oldPassword,oldClient.mdp)
        if(!isMatch){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid Password"})
        }
        if(newPassword !== confirmPassword){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Check the new pasword"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashMDP = await bcrypt.hash(newPassword,salt) as string
        oldClient.mdp = hashMDP
        await oldClient.save()
        res.status(StatusCodes.OK).json({message:"Password updated successfully"})
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const addDemande = async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email,description,titre,date} = req.body
        const idClient:string = req.user?.idClient as string
        if(!email || !description || !titre || !date){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Please enter your credentials"})
        }
        if(!idClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const idClientObjet = new mongoose.Types.ObjectId(idClient)
        if(!idClientObjet){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const oldClient = await Client.findById(idClientObjet,)
        if(!oldClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const oldArtisan = await Artisan.find({email},)
        if(oldArtisan.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const newDemande = new Demande({
            idClient:idClientObjet,
            idArtisan:oldArtisan[0]._id,
            description:description,
            titre:titre,
            date:new Date(date)
        })
        await newDemande.save()
        res.status(StatusCodes.CREATED).json({
            message:"Demande added successfully",
            demande:{
                nomArtisan:oldArtisan[0].nom,
                prenomArtisan:oldArtisan[0].prenom,
                titre:titre,
                description:description,
                date:date
            }
        })
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const annulerDemande = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {idDemande} = req.body
        if(!idDemande){
            return res.status(StatusCodes.BAD_REQUEST).json({mesage:"Please enter your credentials"})
        }
        const oldDemande = await Demande.findById(idDemande)
        if(!oldDemande){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Demande doesn't exists"})
        }
        const dateDemande = oldDemande.date
        const currentDate = dayjs()
        const dateDemandeObjet = dayjs(dateDemande)
        const hoursDifference = dateDemandeObjet.diff(currentDate,'hour')
        if(hoursDifference<=24){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"You can only cancel the request 24 hours before the appointment"})
        }
        oldDemande.annulation = true
        await oldDemande.save()
        res.status(StatusCodes.OK).json({message:"Request canceled successfully"})
    } catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const getConfimedDemande = async(req:Request,res:Response):Promise<any>=>{
    try{
        const idClient:string = req.user?.idClient as string
        if(!idClient){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const idClientObjet = new mongoose.Types.ObjectId(idClient)
        if(!idClientObjet){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Client doesn't exists"})
        }
        const now = new Date(); 
        const RDV = await Demande.find({
            idClient:idClientObjet,
            isConfirmed:true,
            date:{
                $gte: now
            }
        });
        if(RDV.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No RDV for this client"})
        }
        const RDVModifiees = await Promise.all(
            RDV.map(async (rdv) => {
                try {
                    const artisan = await Artisan.findById(rdv.idArtisan); 
                    if (!artisan) {
                        return {
                            message:"Artisan inconnu",
                        };
                    }
                    return {
                        nomArtisan: artisan.nom,
                        prenomArtisan: artisan.prenom, 
                        telArtisan: artisan.tel,
                        titre:rdv.titre,
                        description:rdv.description,
                        date:rdv.date
                    };
                } catch (error) {
                    console.log(`Erreur lors de la récupération de l'artisan pour le rdv ${rdv._id}`, error);
                    return {
                        message: "Erreur artisan", 
                    };
                }
            })
        );
        res.status(StatusCodes.OK).json(RDVModifiees)
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}