const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = newProduct;
    try {
      const checkProduct = await Product.findOne({ name: name });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
        });
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock: Number(countInStock),
        rating,
        description,
        discount: Number(discount),
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
        f;
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        data.stateProductDetails,
        { new: true }
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};
// const getAllProduct = (limit = 1000, page, sort, filter) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const totalProduct = await Product.countDocuments()
//       if (filter){
//         const label = filter[0]
//         const allProductFilter = await Product.find({ [label]: {'$regex' : filter[0]} }).limit(limit).skip(page * limit)
//         resolve({
//           status: "OK",
//           message: "Success",
//           data: allProductFilter,
//           total: totalProduct,
//           pageCurrent: Number(page + 1),
//           totalPage: Math.ceil(totalProduct / limit)
//         })
//     }
//       if (sort){
//           const objectSort = {}
//           objectSort[sort[1]] = sort[0]
//           const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
//           resolve({
//             status: "OK",
//             message: "Success",
//             data: allProductSort,
//             total: totalProduct,
//             pageCurrent: Number(page + 1),
//             totalPage: Math.ceil(totalProduct / limit)
//           })
//       }
//       const allProduct = await Product.find().limit(limit).skip(page * limit)
//       resolve({
//         status: "OK",
//         message: "Success",
//         data: allProduct,
//         total: totalProduct,
//         pageCurrent: Number(page + 1),
//         totalPage: Math.ceil(totalProduct / limit)
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const getAllProduct = (limit = 1000, page = 0, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};

      // Xử lý filter nếu có
      if (filter) {
        const label = filter[0];
        const value = filter[1];
        query[label] = { $regex: value, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
      }

      // Đếm tổng số sản phẩm (theo điều kiện filter nếu có)
      const totalProduct = await Product.countDocuments(query);

      // Xử lý sort nếu có
      const objectSort = {};
      if (sort) {
        objectSort[sort[1]] = sort[0];
      }

      // Lấy danh sách sản phẩm theo filter và sort
      const allProduct = await Product.find(query)
        .limit(limit)
        .skip(page * limit)
        .sort(objectSort);

      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
