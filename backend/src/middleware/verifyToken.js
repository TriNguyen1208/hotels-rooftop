import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function verifyToken(req, res, next){
    try {
        const token = req.headers["authorization"].split(" ")[1];
        if(!token){
            return res.status(401).send({
                message: "No token provided"
            })
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded.userId){ //Do generateToken co payload la userId
            return res.status(401).send({
                message: "Invalid token provided"
            })
        }
        req.userId = decoded.userId;
        req.role = decoded.role
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send({
            message: "Invalid token"
        })
    }
}
export default verifyToken;