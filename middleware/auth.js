const jwt=require("jsonwebtoken");
let {client}=require("../config/redis")
require("dotenv").config();

const authenticator=async(req,res,next)=>{
    try {
        let normalToken=await client.get('normalToken');
        // console.log(normalToken)
        let isPresent=await client.exists(normalToken);
        if(isPresent===1)return res.send("login again");

        let decoded=jwt.verify(normalToken,process.env.normalToken);
        if(decoded){
            req.userId=decoded.userId
            next();
        }else{
            let refreshToken=await client.get('refreshToken');
            let isPresent=await client.exists(refreshToken);
            if(isPresent===1)return res.send("login again");
            let decoded=jwt.verify(refreshToken,process.env.refreshToken);

            let normalToken=jwt.sign({userId:decoded.userId},process.env.normalToken);
            await client.set('normalToken',normalToken);
            req.body.userId=decoded.userId;
            next();
        }
    } catch (error) {
        res.send({"error":error.message,"message":"login Please"});
    }

}

module.exports={
    authenticator
}