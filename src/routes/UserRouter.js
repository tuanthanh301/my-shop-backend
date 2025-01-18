const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')
const { authMiddleWare } = require('../middleware/authMiddleware')

router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)
router.put('/update-user/:id', UserController.updateUser)
router.delete('/delete-user/:id',authMiddleWare, UserController.deleteUser)
router.get('/getAll',authMiddleWare, UserController.getAllUser)
router.get('/get-details/:id', UserController.getDetailsUser)






module.exports = router