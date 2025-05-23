const Order = require("../models/OderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");
// const createOrder = (newOrder) => {
//   return new Promise(async (resolve, reject) => {
//     const {
//       orderItem,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       fullName,
//       address,
//       city,
//       phone,
//       user,
//       isPaid,
//       paidAt,
//       email,
//     } = newOrder;

//     try {
//       const promises = orderItem.map(async (order) => {
//         const productData = await Product.findOneAndUpdate(
//           {
//             _id: order.product,
//             countInStock: { $gte: order.amount },
//           },
//           {
//             $inc: {
//               countInStock: -order.amount,
//               sold: +order.amount,
//             },
//           },
//           { new: true }
//         );
//         if (productData) {
//           const createdOrder = await Order.create({
//             orderItem,
//             shippingAddress: {
//               fullName,
//               address,
//               city,
//               phone,
//             },
//             paymentMethod,
//             itemsPrice,
//             shippingPrice,
//             totalPrice,
//             user: user,
//             isPaid,
//             paidAt,
//           });
//           if (createdOrder) {
//             await EmailService.sendEmailCreateOrder(email, orderItem);
//             return {
//               status: "OK",
//               message: "SUCCESS",
//             };
//           }
//         } else {
//           return {
//             status: "OK",
//             message: "ERR",
//             id: order.product,
//           };
//         }
//       });
//       const results = await Promise.all(promises);
//       const newData = results && results.filter((item) => item.id);
//       if (newData.length) {
//         resolve({
//           status: "ERR",
//           message: `Sản phẩm với id ${newData.join(",")} đã hết hàng`,
//         });
//       }
//       resolve({
//         status: "OK",
//         message: "Success",
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            sold: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              sold: -order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `Sản phẩm với id ${newData.join(",")} không tồn tại`,
        });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItem,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;

    try {
      // Kiểm tra và cập nhật kho hàng
      const failedItems = [];
      for (const order of orderItem) {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              sold: +order.amount,
            },
          },
          { new: true }
        );

        if (!productData) {
          failedItems.push(order.product);
        }
      }

      if (failedItems.length > 0) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id ${failedItems.join(", ")} đã hết hàng`,
        });
      }

      // Tạo đơn hàng duy nhất
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
        user: user,
        isPaid,
        paidAt,
      });

      if (createdOrder) {
        await EmailService.sendEmailCreateOrder(email, orderItem);
        return resolve({
          status: "OK",
          message: "SUCCESS",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllOrder = async () => {
  try {
    const allOrder = await Order.find().sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
    return {
      status: "OK",
      message: "Success",
      data: allOrder,
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder,
};
