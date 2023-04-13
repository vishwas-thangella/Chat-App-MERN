const express = require('express');
const { Addmessage, GetAllMessages } = require('../controllers/MessageController');
const Router = express.Router();


Router.post('/add',Addmessage);
Router.post('/get',GetAllMessages);

module.exports = Router;