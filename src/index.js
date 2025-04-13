const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes')
const cors = require('cors')    // Giúp frontend có thể gọi API từ một domain khác mà không bị chặn bởi trình duyệt.
                                // Tăng cường bảo mật khi chỉ cho phép các domain hoặc phương thức HTTP cụ thể.
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express()
const port = process.env.PORT || 3001;

app.use(cors({
    origin: "http://localhost:3000", // Chỉ định origin cụ thể
    credentials: true, // Cho phép gửi cookie và headers xác thực
  }
))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json())
app.use(cookieParser())

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log("Connect to DB success!")
    })
    .catch((err) => {
        console.log(err)
    })

console.log('process.env.CLIENT_ID',process.env.CLIENT_ID)
app.listen(port, () => {
    console.log('Sever is running in port: ', + port)
});