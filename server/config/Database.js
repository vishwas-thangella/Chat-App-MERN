const mongoose = require('mongoose');
const colors = require('colors')

const ConnectToDB = () =>{
    mongoose.connect(process.env.DB_URI).then(resp=>{
        console.log(colors.green(`Database connected to : ${resp.connection.host}`));
    }).catch(err=>{
        console.log(colors.bgRed(`Db failed to connect : ${err}`));
    });
};

module.exports = ConnectToDB;