const express = require('express');
const router = express.Router();
const Usercontroller = require('./../Controllers/User-controller');

router.route('/signup').post(Usercontroller.signup);

router.route('/login').post(Usercontroller.login);

router.route('/users').get(Usercontroller.getAllUsers);

router.route('/user').get(Usercontroller.singleuser);

router.route('/updatePassword').patch(Usercontroller.protect,Usercontroller.updatePassword)

router.route('/updateProfile').patch(Usercontroller.protect,Usercontroller.updateprofile)

router.route('/deleteuser').delete(Usercontroller.protect,Usercontroller.deleteuser)

module.exports = router;