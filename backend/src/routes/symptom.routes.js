const express = require('express');
const router = express.Router();
const { getAllSymptoms, createSymptomLog, deleteSymptomLog, getAllMoods, createMoodLog } = require('../controllers/symptom.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken);

// Symptom endpoints
router.get('/symptoms', getAllSymptoms);
router.post('/symptoms', createSymptomLog);
router.delete('/symptoms/:id', deleteSymptomLog);

// Mood endpoints
router.get('/moods', getAllMoods);
router.post('/moods', createMoodLog);

module.exports = router;
