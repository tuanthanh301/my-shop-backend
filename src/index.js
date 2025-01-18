const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes')
const bodyParser = require('body-parser')
dotenv.config();

const app = express()
const port = process.env.PORT || 3001;
app.use(bodyParser.json())

routes(app);

mongoose.connect(`${process.env.DB_PASSWORD}`)
    .then(() => {
        console.log("Connect to DB success!")
    })
    .catch((err) => {
        console.log(err)
    })


app.listen(port, () => {
    console.log('Sever is running in port: ', + port)
});