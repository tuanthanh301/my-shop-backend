const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if(err){
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
  });
};
// const authUserMiddleWare = (req, res, next) => {
//     const token = req.headers.token.split(' ')[1]
//     const userId = req.params.id
//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//         if(err){
//             return res.status(404).json({
//                 message: 'The authentication',
//                 status: 'ERROR'
//             })
//         }
//         if (user?.isAdmin || user?.id === userId) {
//             next()
//         } else {
//             return res.status(404).json({
//                 message: 'The authentication',
//                 status: 'ERROR'     
//             })
//         }
//   });
// };
const authUserMiddleWare = (req, res, next) => {
    try {
      const token = req.headers.token?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
          return res.status(403).json({ message: "Token is not valid" });
        }
        req.user = user; // lưu lại thông tin user nếu cần
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
};
