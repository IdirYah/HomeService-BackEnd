import { Request,Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import Artisan from "../../db/models/artisan";
import Client from "../../db/models/client";
import Demande from "../../db/models/demande";
import dayjs from "dayjs";

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

export const addPrestation = async(req:Request,res:Response):Promise<any>=>{
    try{
        const {nomPrestation,maxPrix,minPrix} = req.body   
        const idArtisan:string = req.artisan?.idArtisan as string
        if(!nomPrestation || !maxPrix || !minPrix){
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
        const newPrestation = {
            nomPrestation:nomPrestation as string,
            prixMin:minPrix as number,
            prixMax:maxPrix as number
        }
        oldArtisan.tablePrestation.push(newPrestation)
        await oldArtisan.save()
        res.status(StatusCodes.OK).json({message:"Prestation added successfully"})
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const getDemande = async(req:Request,res:Response):Promise<any>=>{
    try{
        const idArtisan:string = req.artisan?.idArtisan as string
        if(!idArtisan){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const idArtisanObjet = new mongoose.Types.ObjectId(idArtisan)
        if(!idArtisanObjet){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const currentDate = new Date()
        const demandes = await Demande.find({
            idArtisan: idArtisanObjet,
            date: { $gte: currentDate }, 
            annulation: false, 
            isConfirmed: false, 
            isCompleted: false 
        })
        if(demandes.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No demande for this artisan"})
        }
        const demandesModifiees = await Promise.all(
            demandes.map(async (demande) => {
                try {
                    const client = await Client.findById(demande.idClient); 
                    if (!client) {
                        return {
                            message:"Client inconnu",
                        };
                    }

                    return {
                        nomClient: client.nom,
                        prenomClient: client.prenom, 
                        titre:demande.titre,
                        description:demande.description,
                        annulation:demande.annulation,
                        isConfirmed:demande.isConfirmed,
                        isUrgent:demande.isUrgent,
                        date:demande.date
                    };
                } catch (error) {
                    console.log(`Erreur lors de la récupération du client pour la demande ${demande._id}`, error);
                    return {
                        message: "Erreur client", 
                    };
                }
            })
        );
        res.status(StatusCodes.OK).json(demandesModifiees)
    }catch(error){
        console.log("Il y a une erreur",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const confirmDemande = async(req:Request,res:Response):Promise<any>=>{
    try{
        const {idDemande} = req.body
        if(!idDemande){
            return res.status(StatusCodes.BAD_REQUEST).json({mesage:"Please enter your credentials"})
        }
        const oldDemande = await Demande.findById(idDemande)
        if(!oldDemande){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Demande doesn't exists"})
        }
        oldDemande.isConfirmed = true
        await oldDemande.save()
        res.status(StatusCodes.OK).json({message:"Request confirmed successfully"})
    }catch(error){
        console.log("Il y a une erreue",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
}

export const getRDV = async(req:Request,res:Response):Promise<any>=>{
    try{
        const idArtisan:string = req.artisan?.idArtisan as string
        if(!idArtisan){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const idArtisanObjet = new mongoose.Types.ObjectId(idArtisan)
        if(!idArtisanObjet){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Artisan doesn't exists"})
        }
        const now = new Date(); 
        const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const RDV = await Demande.find({
            idArtisan:idArtisanObjet,
            isConfirmed:true,
            date:{
                $gte: now, 
                $lt: next24Hours
            }
        });
        if(RDV.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No RDV for this artisan"})
        }
        const RDVModifiees = await Promise.all(
            RDV.map(async (rdv) => {
                try {
                    const client = await Client.findById(rdv.idClient); 
                    if (!client) {
                        return {
                            message:"Client inconnu",
                        };
                    }

                    return {
                        nomClient: client.nom,
                        prenomClient: client.prenom, 
                        titre:rdv.titre,
                        description:rdv.description,
                        annulation:rdv.annulation,
                        isConfirmed:rdv.isConfirmed,
                        isUrgent:rdv.isUrgent,
                        date:rdv.date
                    };
                } catch (error) {
                    console.log(`Erreur lors de la récupération du client pour le rdv ${rdv._id}`, error);
                    return {
                        message: "Erreur client", 
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