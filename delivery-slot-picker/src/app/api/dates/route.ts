import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import { addDays, eachDayOfInterval, format, isSunday, getDay } from 'date-fns';

interface Slot {
  slot: string;
  full: boolean;
}

interface Day {
  date: string;
  slots: Slot[];
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)

  if (!req.url) {
    return NextResponse.json({ error: 'Invalid request URL' }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const groupSizeParam = searchParams.get('groupSize');
  console.log(groupSizeParam)
  const groupSize = parseInt(groupSizeParam as string, 10) || 3;
  const daysToAdd = 28; // Generate 4 weeks of dates

  let startDate = new Date();
  let availableDates: Day[] = [];

  // Generate dates excluding Sundays
  for (let i = 0; i < daysToAdd; i++) {
    const date = addDays(startDate, i);
    if (!isSunday(date)) {
      availableDates.push({
        date: format(date, 'yyyy-MM-dd'),
        slots: generateSlots(date),
      });
    }
  }

  // Group dates by the given group size
  const groupedDates = groupDates(availableDates, groupSize);


  return NextResponse.json(groupedDates , { status: 200 });
}

// Generate AM, PM, EVE slots for a date
export function generateSlots(date: Date): Slot[] {
  const slots: Slot[] = ['AM', 'PM', 'EVE'].map((slot) => ({
    slot,
    full: false, // Mark all as available by default
  }));

  // Every second Friday, the AM slot is unavailable
  const isSecondFriday = getDay(date) === 5 && Math.floor(date.getDate() / 7) % 2 === 1;
  if (isSecondFriday) {
    slots[0].full = true; // AM slot is unavailable
  }

  return slots;
}

// Group dates into configurable chunks (3 or 4 days at a time)
export function groupDates(dates: Day[], groupSize: number): Day[][] {
  const grouped: Day[][] = [];
  for (let i = 0; i < dates.length; i += groupSize) {
    const group = dates.slice(i, i + groupSize);
    grouped.push(group);
  }
  return grouped;
}
