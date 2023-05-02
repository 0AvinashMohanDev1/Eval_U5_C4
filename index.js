const express=require("express");
const app=express();
const {User}=require("./routes/user.route")
const {connection}=require("./config/db")
/*------------------------------------------------ Logger ------------------------------------------------*/

const expresswinston=require("express-winston");
const winston=require("winston");
require("winston-mongodb");

app.use(expresswinston.logger({
    transports:[
        new winston.transports.File({
            level:"info",
            filename:"loggs.log"
        }),
        new winston.transports.MongoDB({
            level:"info",
            db:`${process.env.mongoURLLogg}`
        })
    ],
    format:winston.format.prettyPrint()
}))

/*------------------------------------------------ Logger ------------------------------------------------*/

app.get("/",(req,res)=>{
    res.send("<h1> HellO HomE PagE</h1>");
})

app.use(express.json());
app.use("",User);

app.listen(4100,async()=>{
    try {
        await connection;
        console.log("connected to server");
    } catch (error) {
        console.log(error.message);
    }
})