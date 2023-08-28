export const isAuth = (req,res,next) =>{
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