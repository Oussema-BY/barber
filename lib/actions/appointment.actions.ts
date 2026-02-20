'use server';

import dbConnect from '@/lib/mongodb';
import Appointment from '@/lib/models/appointment.model';
import Settings from '@/lib/models/settings.model';
import { getSessionContext } from '@/lib/session';
import { getTodayDate, getDayName } from '@/lib/utils';
import type { Appointment as AppointmentType } from '@/lib/types';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export async function getAppointmentsByDate(date: string): Promise<AppointmentType[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const appointments = await Appointment.find({ date, shopId }).sort({ time: 1 });
  return JSON.parse(JSON.stringify(appointments.map((a: { toJSON: () => unknown }) => a.toJSON())));
}

export async function getAllAppointments(): Promise<AppointmentType[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const appointments = await Appointment.find({ shopId }).sort({ date: -1, time: -1 });
  return JSON.parse(JSON.stringify(appointments.map((a: { toJSON: () => unknown }) => a.toJSON())));
}

export async function createServiceAppointment(data: {
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status?: string;
  staffMemberId?: string;
  staffMemberName?: string;
  notes?: string;
}): Promise<AppointmentType> {
  const { shopId } = await getSessionContext();
  if (!shopId) throw new Error('No shop');

  await dbConnect();

  // Check for time conflicts
  const newStart = timeToMinutes(data.time);
  const newEnd = newStart + data.duration;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    date: data.date,
    status: { $nin: ['cancelled'] },
    shopId,
  };

  if (data.staffMemberId) {
    query.staffMemberId = data.staffMemberId;
  }

  const existing = await Appointment.find(query);

  for (const apt of existing) {
    // Only check against other service appointments that have a time slot
    if (!apt.time || apt.time === '00:00' || apt.packageId) continue;

    const existingStart = timeToMinutes(apt.time);
    const existingEnd = existingStart + apt.duration;

    if (newStart < existingEnd && newEnd > existingStart) {
      throw new Error('Time slot conflict: another appointment already exists at this time.');
    }
  }

  const appointment = await Appointment.create({
    ...data,
    shopId,
    status: data.status || 'confirmed',
  });
  return JSON.parse(JSON.stringify(appointment.toJSON()));
}

export async function createPackageAppointment(data: {
  clientName: string;
  packageId: string;
  packageName: string;
  advance?: number;
  eventDate: string;
  date: string;
  price: number;
  status?: string;
  staffMemberId?: string;
  staffMemberName?: string;
  notes?: string;
}): Promise<AppointmentType> {
  const { shopId } = await getSessionContext();
  if (!shopId) throw new Error('No shop');

  await dbConnect();

  if (data.staffMemberId) {
    const existingPackage = await Appointment.findOne({
      shopId,
      staffMemberId: data.staffMemberId,
      date: data.date,
      packageId: { $exists: true, $nin: [null, ''] },
      status: { $nin: ['cancelled'] }
    });

    if (existingPackage) {
      throw new Error('Staff is already reserved for another package on this day.');
    }
  }

  // For packages, we don't enforce time slots, so we default to 00:00 and 1 min duration
  const appointment = await Appointment.create({
    ...data,
    time: '00:00',
    duration: 1,
    shopId,
    status: data.status || 'confirmed',
  });
  return JSON.parse(JSON.stringify(appointment.toJSON()));
}

export async function deleteAppointment(id: string) {
  const { shopId } = await getSessionContext();
  if (!shopId) throw new Error('No shop');

  await dbConnect();
  await Appointment.findOneAndDelete({ _id: id, shopId });
}

export async function getAvailableSlots(
  date: string,
  duration: number,
  staffMemberId?: string
): Promise<string[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();

  const settings = await Settings.findOne({ shopId });
  if (!settings) return [];

  const dayOfWeek = getDayName(date).toLowerCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dayHours = settings.workingHours?.find((wh: any) => wh.day === dayOfWeek);
  if (!dayHours || dayHours.isClosed) return [];

  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    date,
    status: { $nin: ['cancelled'] },
    shopId,
  };

  if (staffMemberId) {
    query.staffMemberId = staffMemberId;
  }

  const existing = await Appointment.find(query);

  const bookedSlots = existing.map((apt: { time: string; duration: number }) => ({
    start: timeToMinutes(apt.time),
    end: timeToMinutes(apt.time) + apt.duration,
  }));

  const slots: string[] = [];
  const increment = 15;

  for (let start = openMinutes; start + duration <= closeMinutes; start += increment) {
    const end = start + duration;

    const hasConflict = bookedSlots.some(
      (booked: { start: number; end: number }) => start < booked.end && end > booked.start
    );

    if (!hasConflict) {
      slots.push(minutesToTime(start));
    }
  }

  return slots;
}

export async function getScheduledDatesForMonth(year: number, month: number): Promise<string[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  await dbConnect();
  // We want dates that have either an appointment or an eventDate
  const appointments = await Appointment.find({
    shopId,
    $or: [
      { date: { $gte: startDate, $lte: endDate } },
      { eventDate: { $gte: startDate, $lte: endDate, $ne: '' } }
    ]
  }).select('date eventDate');

  const dates = new Set<string>();
  appointments.forEach((a: any) => {
    if (a.date) dates.add(a.date);
    if (a.eventDate) dates.add(a.eventDate);
  });

  return Array.from(dates);
}

export async function getUpcomingScheduledAppointments(): Promise<AppointmentType[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  const today = getTodayDate();
  await dbConnect();
  // We want appointments that have a package AND an eventDate in the future
  const appointments = await Appointment.find({
    shopId,
    packageId: { $ne: '' },
    eventDate: { $gte: today, $ne: '' },
  }).sort({ eventDate: 1 }).limit(10);

  return JSON.parse(JSON.stringify(appointments.map((a: { toJSON: () => unknown }) => a.toJSON())));
}

export async function checkStaffPackageAvailability(staffMemberId: string, date: string): Promise<string | null> {
    const { shopId } = await getSessionContext();
    if (!shopId) return null;

    await dbConnect();
    const packageAppointment = await Appointment.findOne({
        shopId,
        staffMemberId,
        date,
        packageId: { $exists: true, $nin: [null, ''] },
        status: { $nin: ['cancelled'] }
    });

    return packageAppointment ? packageAppointment.packageName : null;
}
