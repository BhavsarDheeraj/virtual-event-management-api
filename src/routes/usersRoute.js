const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/usersController');
const { registerUserValidator, loginUserValidator } = require('../utils/validators');


router.post('/register', [registerUserValidator], registerUser);
router.post('/login', [loginUserValidator], loginUser);

module.exports = router;