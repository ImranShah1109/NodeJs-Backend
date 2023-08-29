export const isAuth = (req,res,next) =>{
    // add in the headers x-mytodo variable of username of user form of base64
    if(req.headers['x-mytodo']){
        next();
    }
    else{
        return res.send({
            status : 401,
            message : "User is not authenticated. Please login!"
        });
    }
}