'use server';

import dbConnect from '@/lib/mongodb';
import Appointment from '@/lib/models/appointment.model';
import type { Appointment as AppointmentType } from '@/lib/types';

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
}): Promise<AppointmentType> {
  await dbConnect();
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
