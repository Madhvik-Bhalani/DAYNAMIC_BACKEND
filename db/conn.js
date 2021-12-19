const mongoose = require('mongoose')

const con = async (req, res) => {
    try {
        await mongoose.connect(`${process.env.db}://${process.env.host}/${process.env.dbname}`)
        console.log('connected successfully..');
    } catch (e) {
        console.log(`connection error ${e}`);
        res.send(`connection error ${e}`)

    }
}

con()