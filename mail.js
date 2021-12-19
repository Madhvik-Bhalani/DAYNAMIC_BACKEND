const passmodel=require('./db/passmodel')

const mongoose = require('mongoose')

const con = async (req, res) => {
    try {
        await mongoose.connect(`mongodb://localhost:27017/daynamic_backend`)
        console.log('connected successfully..');
    } catch (e) {
        console.log(`connection error ${e}`);
        res.send(`connection error ${e}`)

    }
}

con()

dt=passmodel.findOne({mail:"madhvik@gmail.com"})
console.log(dt);
