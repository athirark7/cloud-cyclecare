const express = require('express');
const router = express.Router();
const { getAllCycles, createCycle, updateCycle, deleteCycle } = require('../controllers/cycle.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken); // All cycle routes are protected

router.get('/', getAllCycles);
router.post('/', createCycle);
router.put('/:id', updateCycle);
router.delete('/:id', deleteCycle);

module.exports = router;
