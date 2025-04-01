const Order = require("../models/OderProduct");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const { orderItem, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user} = newOrder;  

    try {     
      const createdOrder = await Order.create({
        orderItem,
        shippingAddress: {
            fullName,
            address,
            city,
            phone,  
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user
      });
      console.log('createdOrder',createdOrder)
      if (createdOrder) {
        resolve({
          status: "OK", 
          message: "SUCCESS",
          data: createdOrder,
        });
        f;
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,

};
