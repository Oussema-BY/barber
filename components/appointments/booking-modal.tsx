'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Service, Appointment } from '@/lib/types';
import { getTodayDate, generateId, formatTime } from '@/lib/utils';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  onBooking: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

export function BookingModal({
  open,
  onOpenChange,
  services,
  onBooking,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    date: getTodayDate(),
    time: '10:00',
    notes: '',
  });

  const selectedService = services.find((s) => s.id === formData.serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.serviceId || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    const service = services.find((s) => s.id === formData.serviceId);
    if (!service) return;

    const appointment: Appointment = {
      id: generateId(),
      clientName: formData.clientName,
      clientPhone: formData.clientPhone || undefined,
      clientEmail: formData.clientEmail || undefined,
      serviceId: formData.serviceId,
      serviceName: service.name,
      date: formData.date,
      time: formData.time,
      duration: service.duration,
      price: service.price,
      status: 'pending',
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onBooking(appointment);
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: '',
      date: getTodayDate(),
      time: '10:00',
      notes: '',
    });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Book New Appointment"
      description="Create a new appointment for a client"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name */}
        <Input
          label="Client Name *"
          placeholder="Enter client name"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          required
        />

        {/* Client Phone */}
        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          type="tel"
          value={formData.clientPhone}
          onChange={(e) =>
            setFormData({ ...formData, clientPhone: e.target.value })
          }
        />

        {/* Client Email */}
        <Input
          label="Email"
          placeholder="Enter email address"
          type="email"
          value={formData.clientEmail}
          onChange={(e) =>
            setFormData({ ...formData, clientEmail: e.target.value })
          }
        />

        {/* Service Selection */}
        <Select
          label="Service *"
          value={formData.serviceId}
          onChange={(e) =>
            setFormData({ ...formData, serviceId: e.target.value })
          }
          options={services.map((s) => ({ value: s.id, label: `${s.name} (${s.duration} min)` }))}
          required
        />

        {/* Service Details */}
        {selectedService && (
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
            <p className="text-sm text-indigo-900">
              <span className="font-semibold">Duration:</span> {selectedService.duration} minutes
            </p>
            <p className="text-sm text-indigo-900 mt-1">
              <span className="font-semibold">Price:</span> €{selectedService.price}
            </p>
          </div>
        )}

        {/* Date */}
        <Input
          label="Date *"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        {/* Time */}
        <Select
          label="Time *"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          options={TIME_SLOTS.map((time) => ({ value: time, label: time }))}
          required
        />

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Add any special notes for this appointment..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Book Appointment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
