const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a name'],
        minlength:3,
        maxlength:30
    },
    bio:{
        type:String,
        minlength:1,
        maxlength:100
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        unique:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    followers:{
        type:Array
    },
    following:{
        type:Array
    }
},{timestamps:true})

UserSchema.pre("save",async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.name,role:this.role},process.env.JWT_SECRET,{expiresIn:process.env.EXPIRES_IN})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}

module.exports = mongoose.model('User',UserSchema)