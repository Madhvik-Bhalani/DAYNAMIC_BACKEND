const mongoose = require('mongoose')

const con = async () => {
    try {
        // await mongoose.connect(`${process.env.compass}`)
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('connected successfully..');
    } catch (e) {
        console.log(`connection error ${e}`);

    }
}

con()