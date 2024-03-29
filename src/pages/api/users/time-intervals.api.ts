import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { buildNextAuthOptions } from '../auth/[...nextauth].api';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const timeIntervalsBody = z.object({
  intervals: z.array(
    z.object({
      weekday: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  )
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).end();
  }

  const { intervals } = timeIntervalsBody.parse(req.body);

  await Promise.all(intervals.map((interval) => {
    return prisma.userTimeInterval.create({
      data: {
        weekday: interval.weekday,
        time_start_in_minutes: interval.startTimeInMinutes,
        time_end_in_minutes: interval.endTimeInMinutes,
        user_id: session.user.id
      },
    });
  }));

  return res.status(201).end();
} 