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
      const promises = orderItem.map(async (order) => {
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
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        const arrId = []
        newData.forEach((item) => {
          arrId.push(item.id)
        })
        resolve({
          status: "ERR",
          message: `Sản phẩm với id ${arrId.join(",")} đã hết hàng`,
        });
      } else {
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
          return {
            status: "OK",
            message: "SUCCESS",
          };
        }
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