const mongoose=require("mongoose")


const userModel=new mongoose.Schema({
    name:{
        type:String,
required:[true,"user name is required"],
minlength:[2,"user name shaould be grater then 2 charater long"],
    },
    email:{
type:String,
required:[true,"email is rquired"],
unique:true,
    },
    password:{
        type:String,
        minlength:[3,"password should be more then 3 characters long"],
        required:[true,"password is required"]
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    age:{
        type:Number,
        required:true
    },
    lastActiveAt: { type: Date, default: Date.now },

},{
    versionKey:false,
    timestamps:true
})

module.exports=mongoose.model("user",userModel) 