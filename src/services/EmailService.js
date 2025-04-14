const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();


const sendEmailCreateOrder = async ( email, orderItem ) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  let listItem = ''
  const attachImage = []
  orderItem.forEach((order) => {
    listItem += `<div>
                    <div>Bạn đã đặt sản phẩm <b>${order.name} </b>bên dưới với số lượng <b>${order.amount}</b> với giá là: <b>${order.price} VNĐ</b>
                    <div><img src=${order?.image} alt="sản phẩm"/></div> 
                </div>`
    attachImage.push({path: order.image})
  })
    let info = await transporter.sendMail({
      from: `"TuanThanhShop" <${process.env.MAIL_ACCOUNT}>`,
      to: "tuanthanhk428@gmail.com", // list of receivers
    //   from: process.env.MAIL_ACCOUNT, // sender address
    //   to: email, // list of receivers
      subject: "Thông báo đơn hàng tại TuanThanhShop ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<div> <b>Bạn đã đặt hàng thành công tại TuanThanhShop </b></div> ${listItem}`, 
      attachments: attachImage
    });
};

module.exports = {
    sendEmailCreateOrder,
}