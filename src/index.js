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

// const allowedOrigins = [
//     "http://localhost:3000",
//     "https://my-shop-frontend.vercel.app", // nếu deploy FE lên Vercel
//     "https://my-shop-backend-y7al.onrender.com" // chính domain backend
//   ];
const allowedOrigins = [
  "http://localhost:3000",
  "https://my-shop-backend-y7al.onrender.com",
  "https://my-shop-frontend.vercel.app",
  'my-shop-24iq.vercel.app'

];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép không có origin (Postman, curl, SSR, ...)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
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

app.listen(port, () => {
    console.log('Sever is running in port: ', + port)
});