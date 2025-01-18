const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const {
  generalAccessToken,
  generalRefreshAccessToken,
  generalRefreshToken,
} = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      access_token,
      refresh_token,
    } = newUser;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser !== null) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      // console.log(hash)
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
        access_token,
        refresh_token,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
        f;
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      access_token,
      refresh_token,
    } = userLogin;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The email is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      console.log("comparePassword", comparePassword);
      if (!comparePassword) {
        resolve({
          status: "OK",
          message: "The password or user is incorrect",
        });
      }
      const access_token = await generalAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      // console.log('access_token',access_token)
      resolve({
        status: "OK",
        message: "SUCCESS",
        // data: checkUser,
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id : id
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The email is not defined",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(id,data, { new: true})
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
};
