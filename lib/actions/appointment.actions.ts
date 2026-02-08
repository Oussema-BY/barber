'use server';

import dbConnect from '@/lib/mongodb';
import Appointment from '@/lib/models/appointment.model';
import Settings from '@/lib/models/settings.model';
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
  await dbConnect();
  const appointments = await Appointment.find({ date }).sort({ time: 1 });
  return JSON.parse(JSON.stringify(appointments.map((a: { toJSON: () => unknown }) => a.toJSON())));
}

export async function getAllAppointments(): Promise<AppointmentType[]> {
  await dbConnect();
  const appointments = await Appointment.find().sort({ date: -1, time: -1 });
  return JSON.parse(JSON.stringify(appointments.map((a: { toJSON: () => unknown }) => a.toJSON())));
}

export async function createAppointment(data: {
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
  await dbConnect();

  // Check for time conflicts
  const newStart = timeToMinutes(data.time);
  const newEnd = newStart + data.duration;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    date: data.date,
    status: { $nin: ['cancelled'] },
  };

  // In multi mode, check per-staff; in solo mode, check all
  if (data.staffMemberId) {
    query.staffMemberId = data.staffMemberId;
  }

  const existing = await Appointment.find(query);

  for (const apt of existing) {
    const existingStart = timeToMinutes(apt.time);
    const existingEnd = existingStart + apt.duration;

    if (newStart < existingEnd && newEnd > existingStart) {
      throw new Error('Time slot conflict: another appointment already exists at this time.');
    }
  }

  const appointment = await Appointment.create({
    ...data,
    status: data.status || 'confirmed',
  });
  return JSON.parse(JSON.stringify(appointment.toJSON()));
}

export async function deleteAppointment(id: string) {
  await dbConnect();
  await Appointment.findByIdAndDelete(id);
}

export async function getAvailableSlots(
  date: string,
  duration: number,
  staffMemberId?: string
): Promise<string[]> {
  await dbConnect();

  // Get working hours for the day
  const settings = await Settings.findOne();
  if (!settings) return [];

  const dayOfWeek = new Date(date)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dayHours = settings.workingHours?.find((wh: any) => wh.day === dayOfWeek);
  if (!dayHours || dayHours.isClosed) return [];

  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);

  // Get existing appointments for the day
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    date,
    status: { $nin: ['cancelled'] },
  };

  if (staffMemberId) {
    query.staffMemberId = staffMemberId;
  }

  const existing = await Appointment.find(query);

  const bookedSlots = existing.map((apt: { time: string; duration: number }) => ({
    start: timeToMinutes(apt.time),
    end: timeToMinutes(apt.time) + apt.duration,
  }));

  // Generate available slots in 15-minute increments
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
