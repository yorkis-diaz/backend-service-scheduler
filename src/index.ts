/**
 * Main function that instantiates a Service Scheduler
 * Scheduler Initially populated with a stored pending queue
 */
import path from 'path';
import ServiceScheduler from './modules/scheduler';
import { pendingQueueParser } from './utils/pendingQueueParser';

const pendingQueuePath = path.resolve(
    __dirname,
    'resources',
    'pending_queue.csv'
);

export const initScheduler = async (): Promise<ServiceScheduler> => {
    const scheduler = new ServiceScheduler();

    // Initialize Scheduler with prior customers
    const customers = await pendingQueueParser(pendingQueuePath);
    for (const customer of customers) {
        const [name, phoneNumber, vip] = customer;
        const isVIP = vip === 'true';
        scheduler.checkIn(name?.toUpperCase(), phoneNumber, isVIP);
    }

    return scheduler;
};
