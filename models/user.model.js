const mongoose=require("mongoose");


const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
})

const UserModel=mongoose.model("API_User",userSchema);

module.exports={
    UserModel
}