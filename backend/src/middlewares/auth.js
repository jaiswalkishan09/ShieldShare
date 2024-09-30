const jwt = require('jsonwebtoken');

const auth=(req,res,next)=>{
    let SECRET_KEY=process.env.SECRET_KEY;
    try{
        let token=req.headers.authorization;
        if(token){
           token= token.split(" ")[1];
           let user= jwt.verify(token,SECRET_KEY);
           req.userId = user.userId;
           if(!req.userId)
           {
            return res.status(401).json({message:"Unauthorized User"})
           }
        }
        else{
           return res.status(401).json({message:"Unauthorized User"})
        }
        next();
    }
    catch(e)
    {
        console.log("Error in auth main catch block",e);
        return res.status(401).json({message:"Unauthorized User"})
    }
}

module.exports=auth;