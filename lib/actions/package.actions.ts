'use server';

import dbConnect from '@/lib/mongodb';
import Package from '@/lib/models/package.model';
import Service from '@/lib/models/service.model';
import { getSessionContext } from '@/lib/session';
import type { Package as PackageType } from '@/lib/types';
import mongoose from 'mongoose';

export async function getPackages(): Promise<PackageType[]> {
    const { shopId } = await getSessionContext();
    if (!shopId) return [];

    await dbConnect();
    const packages = await Package.find({ shopId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(packages.map((p: { toJSON: () => unknown }) => p.toJSON())));
}

export async function createPackage(data: {
    name: string;
    description?: string;
    category: string;
    gender: string;
    price: number;
    advance?: number;
    scheduledDate?: string;
    services: string[];
}): Promise<PackageType> {
    const { shopId, shopRole } = await getSessionContext();
    if (!shopId) throw new Error('No shop');
    if (shopRole !== 'owner') throw new Error('Owner only');

    await dbConnect();

    // Validate all services exist and belong to the same shopId
    const serviceObjects = await Service.find({
        _id: { $in: data.services.map(id => new mongoose.Types.ObjectId(id)) },
        shopId
    });

    if (serviceObjects.length !== data.services.length) {
        throw new Error('Some services were not found or do not belong to this shop');
    }

    const newPackage = await Package.create({
        ...data,
        shopId
    });

    return JSON.parse(JSON.stringify(newPackage.toJSON()));
}

export async function getScheduledPackagesByDate(date: string): Promise<PackageType[]> {
    const { shopId } = await getSessionContext();
    if (!shopId) return [];

    await dbConnect();
    const packages = await Package.find({ shopId, scheduledDate: date });
    return JSON.parse(JSON.stringify(packages.map((p: { toJSON: () => unknown }) => p.toJSON())));
}

export async function getUpcomingScheduledPackages(): Promise<PackageType[]> {
    const { shopId } = await getSessionContext();
    if (!shopId) return [];

    const today = new Date().toISOString().split('T')[0];
    await dbConnect();
    const packages = await Package.find({
        shopId,
        scheduledDate: { $gte: today, $ne: '' },
    }).sort({ scheduledDate: 1 }).limit(10);
    return JSON.parse(JSON.stringify(packages.map((p: { toJSON: () => unknown }) => p.toJSON())));
}

export async function getScheduledDatesForMonth(year: number, month: number): Promise<string[]> {
    const { shopId } = await getSessionContext();
    if (!shopId) return [];

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

    await dbConnect();
    const packages = await Package.find({
        shopId,
        scheduledDate: { $gte: startDate, $lte: endDate, $ne: '' },
    }).select('scheduledDate');

    const dates = packages.map((p: { scheduledDate: string }) => p.scheduledDate);
    return [...new Set(dates)];
}

export async function updatePackage(id: string, data: {
    name: string;
    description?: string;
    category: string;
    gender: string;
    price: number;
    advance?: number;
    scheduledDate?: string;
    services: string[];
}): Promise<PackageType> {
    const { shopId, shopRole } = await getSessionContext();
    if (!shopId) throw new Error('No shop');
    if (shopRole !== 'owner') throw new Error('Owner only');

    await dbConnect();

    const serviceObjects = await Service.find({
        _id: { $in: data.services.map(id => new mongoose.Types.ObjectId(id)) },
        shopId
    });

    if (serviceObjects.length !== data.services.length) {
        throw new Error('Some services were not found or do not belong to this shop');
    }

    const updated = await Package.findOneAndUpdate(
        { _id: id, shopId },
        { $set: data },
        { new: true }
    );

    if (!updated) throw new Error('Package not found');
    return JSON.parse(JSON.stringify(updated.toJSON()));
}

export async function deletePackage(id: string) {
    const { shopId, shopRole } = await getSessionContext();
    if (!shopId) throw new Error('No shop');
    if (shopRole !== 'owner') throw new Error('Owner only');

    await dbConnect();
    await Package.findOneAndDelete({ _id: id, shopId });
}
