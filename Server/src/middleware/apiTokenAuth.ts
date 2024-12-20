import{Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const autheticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success:false,
            error: 'Access token is required'
        });
    }

    try{
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        req.user = payload;
        next();
        return;
    }catch(error){
        return res.status(403).json({
            success:false,
            error: 'Invalid token'
        });
    }
};