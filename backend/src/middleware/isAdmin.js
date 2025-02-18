function isAdmin(req, res, next){
    if(req.role !== "admin"){
        return res.status(403).send({
            success: false, 
            message: "This is user. Please log in as admin"
        })
    }
   next();
}
export default isAdmin;