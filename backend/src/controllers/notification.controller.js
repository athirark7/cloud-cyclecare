const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const predictNextPeriod = async (userId) => {
  const cycles = await prisma.cycle.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
    take: 6,
  });

  if (cycles.length === 0) return null;

  let averageCycleLength = 28;
  if (cycles.length >= 2) {
    const lengths = [];
    for (let i = 0; i < cycles.length - 1; i++) {
        const current = new Date(cycles[i].startDate);
        const previous = new Date(cycles[i+1].startDate);
        const diffInMs = Math.abs(current - previous);
        lengths.push(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
    }
    if (lengths.length > 0) {
        averageCycleLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
    }
  }

  const lastCycleStart = new Date(cycles[0].startDate);
  const predictedNextPeriod = new Date(lastCycleStart);
  predictedNextPeriod.setDate(lastCycleStart.getDate() + averageCycleLength);
  return predictedNextPeriod;
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.user;

    const predictedNextPeriod = await predictNextPeriod(userId);
    if (predictedNextPeriod) {
        const today = new Date();
        const diffTime = predictedNextPeriod - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays >= 0) {
            // Generate a notification if it doesn't already exist for this specific scheduled period
            // We can match scheduledFor exactly by using the date part
            const predictedDateString = predictedNextPeriod.toISOString().split('T')[0];
            const startOfDay = new Date(predictedDateString);
            const endOfDay = new Date(predictedDateString);
            endOfDay.setDate(endOfDay.getDate() + 1);

            const existing = await prisma.notification.findFirst({
                where: {
                    userId,
                    type: 'PERIOD_REMINDER',
                    scheduledFor: {
                        gte: startOfDay,
                        lt: endOfDay
                    }
                }
            });

            if (!existing) {
                await prisma.notification.create({
                    data: {
                        userId,
                        type: 'PERIOD_REMINDER',
                        message: `Reminder: Your period is predicted to start in ${diffDays} day(s).`,
                        scheduledFor: startOfDay
                    }
                });
            }
        }
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const existing = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!existing) return res.status(404).json({ message: 'Notification not found' });

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.json(updated);
  } catch (error) {
    console.error('Mark as read Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};
