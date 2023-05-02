const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {client}=require("../config/redis");
const {UserModel}=require("../models/user.model");
require("dotenv").config();
const axios=require("axios")

const User=express.Router();

/*------------------------------------------------ new account creation ------------------------------------------------*/

User.post("/register",async(req,res)=>{
    try {
        let body=req.body;
        let isregister=await UserModel.findOne({email:body.email});
        if(isregister)return res.send("User already present, login please");

        let hashed=bcrypt.hashSync(body.password,5);

        body.password=hashed;
        let user=new UserModel(body);
        await user.save();
        res.send("New account genereted");
    } catch (error) {
        res.send({"error":error.message});
    }
})

/*------------------------------------------------ account login ------------------------------------------------*/

User.post("/login",async(req,res)=>{
    try {
        let body=req.body;
        let isPresent=await UserModel.findOne({email:body.email});
        if(!isPresent) return res.send({"error":"user not present, register first"});

        let isPasswordCorrect= bcrypt.compareSync(body.password,isPresent.password);
        if(!isPasswordCorrect) return res.send({"error":"password not matched"});
        // console.log(isPresent);

        let normalToken=jwt.sign({userId:isPresent._id},process.env.normalToken,{expiresIn:60});
        let refreshToken=jwt.sign({userId:isPresent._id},process.env.refreshToken,{expiresIn:180});

        await client.set('normalToken',normalToken,{EX:60});
        await client.set('refreshToken',refreshToken,{EX:180});

        res.send({"message":"You are logged in"});

    } catch (error) {
        res.send({"error":error.message});
    }
})

/*------------------------------------------------ account logout ------------------------------------------------*/

User.get("/logout",async(req,res)=>{
    try {
        let normalToken=await client.get('normalToken');
        let refreshToken=await client.get('refreshToken');

        await client.set(normalToken,normalToken,{EX:120});
        await client.set(refreshToken,refreshToken,{EX:120});

        res.send("logged out successfullly");
    } catch (error) {
        res.send({'error':error.message})
    }
})

/*------------------------------------------------ getting data ------------------------------------------------*/

const {authenticator}=require("../middleware/auth");

User.get("/user",authenticator,async(req,res)=>{
    try {
        let _id=req.userId;
        let data=await UserModel.findById(_id);
        res.send(data);
    } catch (error) {
        console.log({err:error.message});
    }
})

/*------------------------------------------------ getting IP data ------------------------------------------------*/
const validate = require('ip-validator')

User.get("/city/:ip",authenticator,async(req,res)=>{
    try {
        let ip=req.params.ip;

        if(!validate.ip(ip))return res.send("wrong IP address, please provide a valid API");

        let isPresent=await client.get(ip);
        if(isPresent) return res.send({"city":isPresent});

        console.log("redis crossed");
        let ipData=await axios.get(`https://ipapi.co/${ip}/json/`);

        let city=ipData.data.city;

        client.set(ip,city,{EX:60*60*6});


        res.send({city});
    } catch (error) {
        res.send(error.message);
    }
})

/*------------------------------------------------ function exporter ------------------------------------------------*/

module.exports={
    User
}