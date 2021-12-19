const jwt = require("jsonwebtoken")
const async = require("hbs/lib/async")



const auth2 = async (req, res, next) => {
    try {
        injwt = req.cookies.injwt
        await jwt.verify(injwt, process.env.secretkey)
        next();
    } catch (e) {
        res.render('outwarn')

    }

}

module.exports = auth2