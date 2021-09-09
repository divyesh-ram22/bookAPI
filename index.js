require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Microservices Routes
const Books = require("./API/Book")
const Authors = require("./API/Author")
const Publications = require("./API/Publication")
//Initialization
const booky = express();
//configuration
booky.use(express.json());
//database connection
mongoose.connect(
    process.env.PRIVATE,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
    ).then(()=> console.log("Connection Established with Mongo!!"))

//Initializing microservices
booky.use("/book",Books)
booky.use("/author",Authors)
booky.use("/publication",Publications)


booky.listen(3000, ()=> console.log("Server is running"));