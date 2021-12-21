const mongoose = require('mongoose')
const validator = require('validator')
const unival = require('mongoose-unique-validator')

const scm = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        default: "user"
    },
    mno: {
        unique: true,
        required: true,
        type: Number,
        validate(val) {
            if (val.toString().length > 10) {
                throw new Error("mobile number must be 10 digit")
            }
        }


    },
    mail: {
        type: String,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("invalid email")
            }
        }
    },
    msg: {
        type: String,
        required: true,

    }
})
scm.plugin(unival)

const conmodel = new mongoose.model(`${process.env.CONTACT}`, scm)

module.exports = conmodel;