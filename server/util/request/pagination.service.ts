import { PrismaClient } from "@prisma/client";
import { H3Event, getQuery } from "h3";

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    itemPerPage: number;
    totalPages: number;
}

export interface PaginateOptions<T> {
    count: (prisma: PrismaClient) => Promise<number>
    data: (prisma: PrismaClient, prismaSelectOptions: { take: number, skip: number }) => Promise<T[]>
    page?: number
    itemPerPage?: number,
    maxItemPerPage?: number
}

export async function paginate<T>(
    event: H3Event,
    prisma: PrismaClient,
    options: PaginateOptions<T>
): Promise<PaginatedResponse<T>> {
    const { page, itemPerPage } = getQuery(event);

    const pageValue = options.page || parseInt(page as string) || 1;
    let itemPerPageValue = options.itemPerPage || parseInt(itemPerPage as string) || 10;
    const total = await options.count(prisma);

    if (options.maxItemPerPage) {
        itemPerPageValue = Math.min(itemPerPageValue, options.maxItemPerPage);
    }
    
    const skip = (pageValue - 1) * itemPerPageValue;

    console.log('pageValue', pageValue);
    console.log('itemPerPageValue', itemPerPageValue);
    console.log('skip', skip);
    return {
        items: await options.data(prisma, {take: itemPerPageValue, skip}),
        total,
        page: pageValue,
        itemPerPage: itemPerPageValue,
        totalPages: Math.ceil(total / itemPerPageValue),
    };
}