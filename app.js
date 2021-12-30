require('dotenv').config()
const express = require('express')
const app = express();
const path = require('path')
const hbs = require('hbs')

// db
require('./db/conn.js')
const conmodel = require('./db/conmodel.js');
const async = require('hbs/lib/async');
const upmodel = require("./db/upmodel")
const passmodel = require("./db/passmodel")
const bookmodel = require("./db/book")

const bcrypt = require('bcryptjs')
const ck = require('cookie-parser')
app.use(ck())
const nodemailer = require('nodemailer')
// set view engine
app.set("view engine", "hbs")
viewpath = path.join(__dirname, "./templates/views")
app.set("views", viewpath)

// set partials
partialpath = path.join(__dirname, "/templates/partials")
hbs.registerPartials(partialpath)

// set static ripo.. path
staticpath = path.join(__dirname, "static")
app.use(express.static(staticpath))

// form form data encode
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.get("/", (req, res) => {
    res.statusCode = 200;
    res.render("index", {
        title: "Daynamic_Backend"
    })

})

// get contact form data
app.post("/contact", async (req, res) => {
    try {
        const condata = new conmodel({
            name: req.body.name,
            mno: req.body.mno,
            mail: req.body.mail,
            msg: req.body.msg
        })

        await condata.save();



        res.render('index')
    } catch (e) {
        res.send(`contact form error ${e.message}`)

    }
})

// signup
app.get("/signup", async (req, res) => {
    try {
        res.statusCode = 200
        res.render("signup")
    } catch (e) {
        res.statusCode = 201
        res.send(`sign up error ${e}`)

    }
})

app.post("/signup", async (req, res) => {
    try {


        if (req.body.pass === req.body.cpass) {

            const data = new upmodel({
                name: req.body.name,
                mail: req.body.mail,
                mno: req.body.mno,
                pass: req.body.pass,
            })

            // genrate token
            const token = await data.gentoken();

            // save into cookie
            res.cookie("upjwt", token, {
                expires: new Date(Date.now() + 1800000),
                httpOnly: true
            })

            await data.save();
            res.render("index", {
                user: req.body.mail
            })
        }
        else {
            res.send(`password does not match`)
        }
    } catch (e) {
        res.statusCode = 201
        res.send(`sign up error:${e}`)
    }

})

// signin
app.get("/signin", async (req, res) => {
    try {
        res.statusCode = 200
        res.render("signin")
    } catch (e) {
        res.statusCode = 201
        res.send(`sign in error ${e}`)

    }
})

app.post("/signin", async (req, res) => {
    try {
        const mail = req.body.mail
        const indata = await upmodel.findOne({ mail })

        ismatch = await bcrypt.compare(req.body.pass, indata.pass)
        if (ismatch) {
            const token = await indata.gentoken()


            res.cookie("injwt", token, {
                expires: new Date(Date.now() + 31556952000),
                httpOnly: true
            })
            res.statusCode = 200;
            res.render('index', {
                user: mail
            })
        }
        else {
            res.send(`invalid sign in details`)
        }
    } catch (e) {
        res.statusCode = 201
        res.send(`sign in error:${e}`)

    }
})

// change password
const auth = require('./auth') //require auth
app.get("/changepass", auth, async (req, res) => {
    try {

        res.statusCode = 200
        res.render('changepass')
    } catch (e) {
        res.statusCode = 404
        res.send(`change password error:${e}`)

    }
})
app.post("/changepass", async (req, res) => {
    try {
        mail = req.body.mail;
        maildata = await upmodel.findOne({ mail })



        // genrate otp
        const otp = Math.round(Math.random() * 10000)
        // data save to otpcollection
        const data = new passmodel({
            mail: mail,
            otp: otp
        })

        await data.save();
        // send mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host:"smtp.gmail.com",
            port: 465,
            secure:true,
            auth: {
                user: `${process.env.USER}`,
                pass: `${process.env.PASS}`
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailoptions = {
            from: "cecile.schmeler82@ethereal.email",
            to: mail,
            subject: "your otp",
            text: `${otp}\n keep it secure and don't share with anyone`

        }

        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(info.response);
                res.send(info.response);
            }

        })



        res.render('confirmpass', {
            mail
        })

    } catch (e) {
        res.statusCode = 404
        res.send(`mail is invalid:${e}`)

    }
})
// reset
app.get("/confirmpass", async (req, res) => {
    try {
        res.render('confirmpass')
    } catch (e) {
        res.statusCode = 400,
            res.send(`page redirect error:${e}`)

    }
})
app.post("/confirmpass", async (req, res) => {
    try {
        const otp = req.body.confirmotp
        const data = await passmodel.findOne({ otp });
        const mail = data.mail;
        // console.log(mail);
        await upmodel.findOne({ mail });

        recenttime = new Date().getTime()

        const diff = data.expire - recenttime;
        // console.log(diff);
        if (diff < 0) {
            await passmodel.deleteOne({ otp })
            res.render('changepass')
        }
        else {
            if (otp == data.otp) {
                if (req.body.pass === req.body.cpass) {
                    rpass = req.body.pass
                    console.log(rpass);
                    hashpass = await bcrypt.hash(rpass, 10)
                    // console.log(hashpass);
                    updated = await upmodel.findOneAndUpdate({ mail }, { pass: hashpass }, {
                        new: true
                    })
                    // console.log(updated);

                    res.render('index')
                }
                else {
                    res.send(`password does not match`)
                }
            }
            else {
                res.send('otp invalid')
            }
        }
    } catch (error) {
        res.statusCode = 404;
        res.send(`reset password error:${error}`)

    }
})
// sign out
const auth2 = require("./auth2")
app.get("/signout", auth2, async (req, res) => {
    try {
        res.clearCookie('injwt')
        res.statusCode = 200;
        res.render('index')
    } catch (e) {
        res.send(`sign out error:${e}`)

    }

})

//book aointment
app.get("/book", async (req, res) => {
    try {
        res.statusCode = 200
        res.render("book")
    } catch (e) {
        res.statusCode = 400
        res.send("book ap render error" + e)

    }
})
app.post("/book", async (req, res) => {
    try {
        const data = new bookmodel({
            name: req.body.name,
            email: req.body.email,
            mno: req.body.mno,
            dt: req.body.dt,
            slot: req.body.slot,
            response: req.body.response
        })
        var name = req.body.name
        var email = req.body.email
        var mno = req.body.mno
        var dt = req.body.dt
        var slot = req.body.slot
        var response = req.body.response

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "romaine.bradtke37@ethereal.email",
                pass: "Q6gPjkgERmCtjhpKYf"
            }
        })

        const mailoptions = {
            from: "romaine.bradtke37@ethereal.email",
            to: `${email}`,
            subject: "Your Appointment Is Booked",
            text: `Your Appointment Is Booked Mr.${name}\nYour Appointment Is Booked At ${dt} In The ${slot}\nPlease Come According To Your Slot At Our Office (Our Address Is Defined At our Website) OtherWise Your Appointment Will Be Cancelled\n\nTHANK YOU..!`


        }

        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(info.response);
            }

        })




        await data.save();
        res.render("index")
    } catch (e) {
        res.statusCode = 400
        res.send("book appointment post error" + e)

    }
})
// server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server start at ${port}`);
})