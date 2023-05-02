const {createClient}=require("redis");
require("dotenv").config();
const client=createClient();

client.on("error",(err)=>{console.log(err.message)});

// client.connect({
//     URL:`redis://${process.env.redisUserName}:${process.env.redisUserPassword}@redis-18107.c305.ap-south-1-1.ec2.cloud.redislabs.com:18107`
// })

client.connect();

client.on("ready",()=>{console.log("connected to redis")});

module.exports={
    client
}