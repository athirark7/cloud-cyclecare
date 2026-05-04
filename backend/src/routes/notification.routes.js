const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notification.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;
