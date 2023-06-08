/**
 * CSV parser that returns a list of stored customers' data
 */
import fs from 'fs';
import { parse } from 'csv-parse';

export const pendingQueueParser = async (
    pendingQueuePath: string
): Promise<Array<string[]>> => {
    const customers: Array<string[]> = [];

    fs.createReadStream(pendingQueuePath);

    const pendingQueue = fs.createReadStream(pendingQueuePath);
    const parser = pendingQueue.pipe(parse({ columns: false, trim: true }));

    for await (const customer of parser) {
        customers.push(customer);
    }

    return customers?.slice(1);
};
