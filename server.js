require('dotenv').config();
const express = require("express");
const connectDB = require('./config/db');
const app = express();
const userRoute = require('./routers/userRoute');
const errorhandler = require('./Controllers/error-controller');


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(userRoute);



const connect = async()=>{
    try {
        await connectDB(process.env.DB_URL);
    app.listen(process.env.PORT,()=>{
        console.log(`Server running on ${process.env.PORT}`)
    })
        
    } catch (error) {
        console.log(error);
    }
    

}

connect();

app.use(errorhandler);



