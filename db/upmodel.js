const mongoose = require('mongoose')
const validator = require('validator')
const unival = require('mongoose-unique-validator')
const async = require('hbs/lib/async')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')

const scm = new mongoose.Schema({

    name: {
        type: String,
        maxlength: 25,
        required: true,
        minlength: 2
    },
    mail: {
        unique: true,
        type: String,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("invalid mail")
            }
        }
    },
    mno: {
        unique: true,
        type: Number,
        required: true,
        validate(val) {
            if (val.toString().length > 10) {
                throw new Error("mobile number must be 10 digit and valid")
            }
        }

    },
    pass: {
        type: String,
        required: true
    },
    tokens: [{

        token: {
            type: String,
            required: true
        }
    }]


})
scm.plugin(unival)

scm.pre("save", async function (next) {
    try {
        if (this.isModified("pass")) {
            this.pass = await bcrypt.hash(this.pass, 10)
            next();
        }
    } catch (e) {
        console.log(`hashing error of sign up ${e}`);

    }
})

scm.methods.gentoken=async function(next){
    try {
       token=await jwt.sign({_id:this._id},process.env.secretkey)
       this.tokens=this.tokens.concat({token:token})
       return token;
    //    next();
    } catch (e) {
        console.log(`token genrate erroe sign up:${e}`);
        
    }

}

const upmodel = new mongoose.model("signup", scm)

module.exports = upmodel