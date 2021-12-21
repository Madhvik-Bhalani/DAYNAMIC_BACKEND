const jwt = require("jsonwebtoken")
const async = require("hbs/lib/async")
const upmodel=require("./db/upmodel")


const auth = async (req, res, next) => {
    try {
        upjwt = req.cookies.upjwt
        injwt = req.cookies.injwt
        data=await jwt.verify((upjwt||injwt), process.env.SKEY)
        // const _id=data._id;
        // const finaldata=await upmodel.findOne({_id})
        // mail=finaldata.mail
        next();
    } catch (e) {
        res.render('passwarn')

    }

}

module.exports = auth