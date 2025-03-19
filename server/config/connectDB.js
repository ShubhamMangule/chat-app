const mongoose = require('mongoose');

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const connection= mongoose.connection;        
        connection.on("connection", ()=>{
            console.log('Connected to DB');
        })
        connection.on("error",(error)=>{
        console.log('Something is wrong in MongoDB connection',error);
        })        
    } catch (error) {
        console.log("Something went wrong",error);
    }
}

module.exports =connectDB;