const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/dashboard.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.get('/insights', authenticateToken, getInsights);

module.exports = router;
