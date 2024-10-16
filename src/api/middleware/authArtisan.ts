import jwt from "jsonwebtoken"
import {Request , Response , NextFunction} from "express"
import {StatusCodes} from "http-status-codes"

declare module "express"{
    interface Request{
        artisan?:{
            idArtisan:string
        }
    }
}

interface jwtPayload{
    idArtisan:string;
}

const authArtisan = (req:Request,res:Response,next:NextFunction):any => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(StatusCodes.UNAUTHORIZED).json({error:"Authentication invalid"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET as string) as jwtPayload
        req.artisan = {idArtisan:payload.idArtisan}
        next()
    } catch (error) {
        console.log('Il y a une erreur',error)
        res.status(StatusCodes.UNAUTHORIZED).json({error:"Authentication invalid"})
    }
}

export default authArtisan