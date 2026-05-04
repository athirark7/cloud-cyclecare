const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getInsights = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch cycles to calculate average length and predict next period
    const cycles = await prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: 6,
    });

    let averageCycleLength = 28; // Default average
    let predictedNextPeriod = null;
    let cycleHistoryData = [];

    if (cycles.length >= 2) {
      const lengths = [];
      for (let i = 0; i < cycles.length - 1; i++) {
          const current = new Date(cycles[i].startDate);
          const previous = new Date(cycles[i+1].startDate);
          const diffInMs = Math.abs(current - previous);
          const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
          lengths.push(diffInDays);
      }
      
      if (lengths.length > 0) {
          averageCycleLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
      }
      
      // Predict next period based on the last cycle start date
      const lastCycleStart = new Date(cycles[0].startDate);
      predictedNextPeriod = new Date(lastCycleStart);
      predictedNextPeriod.setDate(lastCycleStart.getDate() + averageCycleLength);
    } else if (cycles.length === 1) {
        // If only one cycle, just use default/average
        const lastCycleStart = new Date(cycles[0].startDate);
        predictedNextPeriod = new Date(lastCycleStart);
        predictedNextPeriod.setDate(lastCycleStart.getDate() + 28);
    }

    // Symptom trends (frequency)
    const symptoms = await prisma.symptomLog.findMany({
        where: { userId },
        select: { symptomType: true }
    });

    const frequencyMap = {};
    symptoms.forEach(s => {
        frequencyMap[s.symptomType] = (frequencyMap[s.symptomType] || 0) + 1;
    });

    const frequentSymptoms = Object.entries(frequencyMap)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type]) => type);

    res.json({
      averageCycleLength,
      predictedNextPeriod,
      frequentSymptoms,
      recentCycles: cycles.map(c => ({
          startDate: c.startDate,
          endDate: c.endDate,
          length: c.cycleLength
      }))
    });
  } catch (error) {
    console.error('Get Insights Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getInsights,
};
