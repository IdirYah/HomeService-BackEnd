import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Request,Response } from "express"
import {StatusCodes} from "http-status-codes"
import Client from "../../db/models/client"
import Artisan from "../../db/models/artisan"
import artisan from "../../db/models/artisan"

export const registerClient = async(req:Request,res:Response):Promise<any> =>{
    try {
        const {nom,prenom,tel,adresse,email,mdp} = req.body
        if(!nom || !prenom || !tel || !adresse || !email || !mdp){
            return res.status(StatusCodes.BAD_REQUEST).json({message:'Please provide your credentials'})
        }
        const existClient = await Client.exists({
            $or:[{tel},{email}]
        })
        if(existClient){
            return res.status(StatusCodes.CONFLICT).json({message:'Client has already exits'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashMDP = await bcrypt.hash(mdp,salt) as string
        const newClient = new Client({
            nom:nom,
            prenom:prenom,
            tel:tel,
            adresse:adresse,
            email:email,
            mdp:hashMDP,
        })
        const savedClient = await newClient.save()
        const token = jwt.sign({id:savedClient._id},"SECRETKEY",{expiresIn:"1h"})
        res.status(StatusCodes.CREATED).json({
            success:true,
            client:{
                nom,
                prenom,
                tel,
                adresse,
                email,
                token
            }
        })
    } catch (error) {
        console.log('Il y a une erreur',error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error'})
    }
}

export const loginClient = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {email,mdp} = req.body
        if(!email || !mdp){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Please provide your credentials"})
        }
        const client = await Client.findOne({email})
        if(!client){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid credentials"})
        }
        const isValidPassword = await bcrypt.compare(mdp,client.mdp)
        if(!isValidPassword){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid credentials"})
        }
        const token = jwt.sign({id:client._id},"SECRETKEY",{expiresIn:"1h"})
        res.status(StatusCodes.OK).json({
            success:true,
            client:{
                token,
            }
        })
    } catch (error) {
        console.log('Il y a une erreur',error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error'})
    }
}

export const registerArtisan = async(req:Request,res:Response):Promise<any> =>{
    try {
        const {nom,prenom,tel,adresse,email,mdp,domaine} = req.body
        if(!nom || !prenom || !tel || !adresse || !email || !mdp){
            return res.status(StatusCodes.BAD_REQUEST).json({message:'Please provide your credentials'})
        }
        const existArtisan = await Artisan.exists({
            $or:[{tel},{email}]
        })
        if(existArtisan){
            return res.status(StatusCodes.CONFLICT).json({message:'Artisan has already exits'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashMDP = await bcrypt.hash(mdp,salt) as string
        const newArtisan = new Artisan({
            nom:nom,
            prenom:prenom,
            tel:tel,
            adresse:adresse,
            email:email,
            mdp:hashMDP,
            domaine:domaine,
        })
        const savedArtisan = await newArtisan.save()
        const token = jwt.sign({id:savedArtisan._id},"SECRETKEY",{expiresIn:"1h"})
        res.status(StatusCodes.CREATED).json({
            success:true,
            artisan:{
                nom,
                prenom,
                tel,
                adresse,
                email,
                domaine,
                token
            }
        })
    } catch (error) {
        console.log('Il y a une erreur',error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error'})
    }
}

export const loginArtisan = async(req:Request,res:Response):Promise<any>=>{
    try {
        const {email,mdp} = req.body
        if(!email || !mdp){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Please provide your credentials"})
        }
        const artisan = await Artisan.findOne({email})
        if(!artisan){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid credentials"})
        }
        const isValidPassword = await bcrypt.compare(mdp,artisan.mdp)
        if(!isValidPassword){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"Invalid credentials"})
        }
        const token = jwt.sign({id:artisan._id},"SECRETKEY",{expiresIn:"1h"})
        res.status(StatusCodes.OK).json({
            success:true,
            artisan:{
                token,
            }
        })
    } catch (error) {
        console.log('Il y a une erreur',error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error'})
    }
}