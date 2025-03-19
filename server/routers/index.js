const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUser = require('../controller/searchUser');

const router = express.Router();

// create user API
router.post('/register', registerUser);

// check user Email
router.post('/email', checkEmail);

// check User Password
router.post('/password', checkPassword);

// login user Details
router.get('/user-details', userDetails);

// update user details
router.post('/update-user', updateUserDetails);

// logout user
router.get('/logout', logout);

// search user
router.post('/search-user', searchUser);

module.exports = router;
