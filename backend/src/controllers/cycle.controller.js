const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getAllCycles = async (req, res) => {
  try {
    const { userId } = req.user;
    const cycles = await prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: {
        symptomLogs: true,
        moodLogs: true,
      },
    });
    res.json(cycles);
  } catch (error) {
    console.error('Get All Cycles Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCycle = async (req, res) => {
  try {
    const { userId } = req.user;
    const { startDate, endDate } = req.body;

    if (!startDate) {
      return res.status(400).json({ message: 'Start date is required' });
    }

    let cycleLength = null;
    if (endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      cycleLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const cycle = await prisma.cycle.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        cycleLength,
      },
    });

    res.status(201).json(cycle);
  } catch (error) {
    console.error('Create Cycle Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCycle = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { startDate, endDate } = req.body;

    const existingCycle = await prisma.cycle.findUnique({
      where: { id },
    });

    if (!existingCycle || existingCycle.userId !== userId) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    let cycleLength = existingCycle.cycleLength;
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(existingCycle.startDate);
      const end = endDate ? new Date(endDate) : (existingCycle.endDate ? new Date(existingCycle.endDate) : null);
      
      if (start && end) {
        const diffTime = Math.abs(end - start);
        cycleLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }

    const updatedCycle = await prisma.cycle.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        cycleLength,
      },
    });

    res.json(updatedCycle);
  } catch (error) {
    console.error('Update Cycle Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCycle = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const existingCycle = await prisma.cycle.findUnique({
      where: { id },
    });

    if (!existingCycle || existingCycle.userId !== userId) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    await prisma.cycle.delete({
      where: { id },
    });

    res.json({ message: 'Cycle deleted successfully' });
  } catch (error) {
    console.error('Delete Cycle Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCycles,
  createCycle,
  updateCycle,
  deleteCycle,
};
