const express = require('express');
const { acessChats, fetchChats, createGroupChat, renameChat, addUser, removeUser } = require('../controllers/chatControllers');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.route('/').post(protect, acessChats);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameChat);
router.route('/groupadd').put(protect, addUser);
router.route('/groupremove').put(protect, removeUser);
module.exports = router