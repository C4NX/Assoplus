import { PrismaClient } from "@prisma/client";
import { H3Event, getQuery } from "h3";

/**
 * An paginated response of T
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    itemPerPage: number;
    totalPages: number;
}

/**
 * Options for the prisma pagination function
 */
export interface PaginateOptions<T> {
    /**
     * Async function to count the number of items
     * @param prisma Prisma client
     * @returns The number of items
     */
    count: (prisma: PrismaClient) => Promise<number>
    /**
     * Async function to get the data
     * @param prisma Prisma client
     * @param prismaSelectOptions Prisma select options (take, skip)
     * @returns An array of T
     */
    data: (prisma: PrismaClient, prismaSelectOptions: { take: number, skip: number }) => Promise<T[]>
    /**
     * Default page number
     */
    page?: number
    /**
     * Default number of items per page
     */
    itemPerPage?: number,
    /**
     * Maximum number of items per page
     */
    maxItemPerPage?: number
}

/**
 * Helper function to paginate data from prisma and h3
 * @param event H3 event (for context)
 * @param prisma  Prisma client
 * @param options Options for the pagination
 * @returns A paginated response of T
 */
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

    return {
        items: await options.data(prisma, {take: itemPerPageValue, skip}),
        total,
        page: pageValue,
        itemPerPage: itemPerPageValue,
        totalPages: Math.ceil(total / itemPerPageValue),
    };
}