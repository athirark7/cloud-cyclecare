const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getAllSymptoms = async (req, res) => {
  try {
    const { userId } = req.user;
    const symptoms = await prisma.symptomLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(symptoms);
  } catch (error) {
    console.error('Get All Symptoms Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createSymptomLog = async (req, res) => {
  try {
    const { userId } = req.user;
    const { date, symptomType, severity, cycleId } = req.body;

    if (!date || !symptomType) {
      return res.status(400).json({ message: 'Date and symptom type are required' });
    }

    const log = await prisma.symptomLog.create({
      data: {
        userId,
        cycleId: cycleId || null,
        date: new Date(date),
        symptomType,
        severity: severity || 1,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Create Symptom Log Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSymptomLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const log = await prisma.symptomLog.findUnique({
      where: { id },
    });

    if (!log || log.userId !== userId) {
      return res.status(404).json({ message: 'Symptom log not found' });
    }

    await prisma.symptomLog.delete({
      where: { id },
    });

    res.json({ message: 'Symptom log deleted successfuly' });
  } catch (error) {
    console.error('Delete Symptom Log Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllMoods = async (req, res) => {
  try {
    const { userId } = req.user;
    const moods = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(moods);
  } catch (error) {
    console.error('Get All Moods Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createMoodLog = async (req, res) => {
  try {
    const { userId } = req.user;
    const { date, moodType, cycleId } = req.body;

    if (!date || !moodType) {
      return res.status(400).json({ message: 'Date and mood type are required' });
    }

    const log = await prisma.moodLog.create({
      data: {
        userId,
        cycleId: cycleId || null,
        date: new Date(date),
        moodType,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Create Mood Log Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllSymptoms,
  createSymptomLog,
  deleteSymptomLog,
  getAllMoods,
  createMoodLog,
};
