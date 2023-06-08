/**
 * Script that runs and processes an active queue based on pending queue customers
 */
import { initScheduler } from '../index';

const serve = (millis: number): Promise<unknown> => {
    return new Promise((resolve) => setTimeout(resolve, millis));
};

(async (): Promise<void> => {
    let customersServed = 0;
    const Scheduler = await initScheduler();

    while (customersServed < Scheduler.queueNumber) {
        const currentCustomer = Scheduler.getNextCustomer();
        if (!currentCustomer) {
            console.log(`No customers in the queue`);
            return;
        }
        console.log(
            `Now serving customer #${currentCustomer?.ticketNumber} - ${
                currentCustomer?.isVIP ? 'VIP' : 'Standard'
            }`
        );
        await serve(2000);
        customersServed++;
    }
})();
