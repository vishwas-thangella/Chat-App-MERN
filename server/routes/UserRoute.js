const express = require('express');
const { Signup, Signin, GetAllusers, GetSingleUser } = require('../controllers/UserController');

const Router = express.Router();

Router.post('/signup',Signup);
Router.post('/signin',Signin);
Router.get('/getallusers/:id',GetAllusers);
Router.get('/user/:id',GetSingleUser);

module.exports = Router;