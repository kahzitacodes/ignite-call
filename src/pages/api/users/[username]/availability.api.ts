import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const username = String(req.query.username);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date not provided' });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    }
  });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf('day').isBefore(new Date());

  if (isPastDate) {
    return res.json({ userAgenda: [], availableAgenda: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      weekday: referenceDate.get('day'),
    }
  });

  if (!userAvailability) {
    return res.json({ userAgenda: [], availableAgenda: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const userAgenda = Array
    .from({ length: endHour - startHour })
    .map((_, index) => {
      return startHour + index;
    });

  const blockedTimes = await prisma.schedule.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      }
    }
  });

  const availableAgenda = userAgenda.filter(time => {
    const isTimeblocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time);

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date());

    return !isTimeblocked && !isTimeInPast;
  });

  return res.json({ userAgenda, availableAgenda });
};