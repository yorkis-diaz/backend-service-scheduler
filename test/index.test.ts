import { initScheduler } from '@src/index';
import ServiceScheduler from '@src/modules/scheduler';

let Scheduler: ServiceScheduler;

describe('#initScheduler', () => {
    beforeAll(async () => {
        Scheduler = await initScheduler();
    });
    test('should process all customers based on priority', async () => {
        for (let count = 0; count <= Scheduler.queueNumber; count++) {
            if (Scheduler.vipCustomerQueue.length < 2) return;
            const [vipCustomer, vipCustomer2, standardCustomer] = [
                Scheduler.getNextCustomer(),
                Scheduler.getNextCustomer(),
                Scheduler.getNextCustomer(),
            ];
            expect(vipCustomer?.isVIP).toBeTruthy();
            expect(vipCustomer2?.isVIP).toBeTruthy();
            expect(standardCustomer?.isVIP).toBeFalsy();
        }
    });
});
