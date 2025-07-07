import jwt from 'jsonwebtoken';

export function jwtcreate(payload){
    const secretKey = process.env.JWT_SECRET;
    const options = {
    algorithm: 'HS256',
    expiresIn: '2d'
    }
    try {
        return jwt.sign(payload,secretKey,options);
    } catch (error) {
        console.error('Failed Creating JWT:', error);
        throw error
    }
}

export function jwtvalidate(token){
    const secretKey = process.env.JWT_SECRET;
    try {
        return jwt.verify(token,secretKey,{algorithms: ['HS256']});
    } catch (error) {        
        console.error('Failed Validating JWT:', error);
        throw error
    }
}

