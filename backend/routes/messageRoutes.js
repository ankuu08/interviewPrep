const express = require('express');
const { protect } = require('../middleware/authmiddleware');
const { sendMessage, allMessages, aiMessages } = require('../controllers/messageControllers');

const router = express.Router();

router.route("/").post(protect, sendMessage)
router.route("/ai").post(protect, aiMessages);
router.route("/:chatId").get(protect, allMessages);
module.exports = router;