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
    price: number;
    duration: number;
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

export async function deletePackage(id: string) {
    const { shopId, shopRole } = await getSessionContext();
    if (!shopId) throw new Error('No shop');
    if (shopRole !== 'owner') throw new Error('Owner only');

    await dbConnect();
    await Package.findOneAndDelete({ _id: id, shopId });
}
