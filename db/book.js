const mongoose = require("mongoose")
const unival = require("mongoose-unique-validator")
const validator = require("validator")

const scm = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("invalid mail")
            }
        }
    },
    mno: {
        required: true,
        type: Number,
        unique:true,
        validate(val) {
            if (val.toString().length > 10) {
                throw new Error("mobile number must be 10 digit and valid")
            }
        }
    },
    dt: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
        
    },
    response:{
        type: String,
        required: true

    }
})

scm.plugin(unival)

const bookmodel=new mongoose.model("appointment",scm);

module.exports=bookmodel;