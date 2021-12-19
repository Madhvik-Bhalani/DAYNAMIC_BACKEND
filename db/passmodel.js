const timespan = require('jsonwebtoken/lib/timespan')
const mongoose=require('mongoose')
const validator=require('validator')
const unival=require('mongoose-unique-validator')


const scm=new mongoose.Schema({
    mail:{
        type:String,
        required:true,
        validate(val){
            if(! validator.isEmail(val)){
                throw new Error("invlaid email")
            }
        }
    },
    otp:{
        type:Number,
        required:true
    },
    expire:{
        type:String,
        required:true,
        default:new Date().getTime()+300000
    }
})

const passmodel=new mongoose.model("otpdata",scm)

module.exports=passmodel


