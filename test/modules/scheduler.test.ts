import ServiceScheduler from '@src/modules/scheduler';
import Customer from '@src/modules/customer';

const retrieveScheduler = (): ServiceScheduler => {
    return new ServiceScheduler();
};

describe('#Scheduler', () => {
    test('should instantiate scheduler class', () => {
        const Scheduler = retrieveScheduler();
        expect(Scheduler.queueNumber).toEqual(1);
        expect(Scheduler.customerQueue).toHaveLength(0);
        expect(Scheduler.vipCustomerQueue).toHaveLength(0);
        expect(Scheduler.currentCustomer).toBeUndefined();
        expect(Scheduler.numberOfCurrentVIPCustomersServed).toEqual(0);
    });

    describe('CheckIn', () => {
        test('should check in customers to the standard queue', () => {
            const Scheduler = retrieveScheduler();
            const firstCustomer: Record<string, string> = {
                name: 'john',
                number: '123456789',
            };
            const secondCustomer: Record<string, string> = {
                name: 'jane',
                number: '987654321',
            };
            Scheduler.checkIn(firstCustomer.name, firstCustomer.number, false);
            Scheduler.checkIn(
                secondCustomer.name,
                secondCustomer.number,
                false
            );
            const firstCustomerInQueue = Scheduler.customerQueue[0];
            const secondCustomerInQueue = Scheduler.customerQueue[1];

            expect(Scheduler.queueNumber).toEqual(3);
            expect(Scheduler.customerQueue).toHaveLength(2);
            expect(Scheduler.vipCustomerQueue).toHaveLength(0);
            expect(Scheduler.currentCustomer).toBeUndefined();
            expect(firstCustomerInQueue?.name).toEqual(firstCustomer.name);
            expect(firstCustomerInQueue?.ticketNumber).toEqual(1);
            expect(firstCustomerInQueue?.isVIP).toBeFalsy();
            expect(secondCustomerInQueue?.name).toEqual(secondCustomer.name);
            expect(secondCustomerInQueue?.ticketNumber).toEqual(2);
            expect(secondCustomerInQueue?.isVIP).toBeFalsy();
        });

        test('should check in customers to the VIP queue', () => {
            const Scheduler = retrieveScheduler();
            const firstCustomer: Record<string, string> = {
                name: 'john',
                number: '123456789',
            };
            const secondCustomer: Record<string, string> = {
                name: 'jane',
                number: '987654321',
            };
            Scheduler.checkIn(firstCustomer.name, firstCustomer.number, true);
            Scheduler.checkIn(secondCustomer.name, secondCustomer.number, true);
            const firstCustomerInQueue = Scheduler.vipCustomerQueue[0];
            const secondCustomerInQueue = Scheduler.vipCustomerQueue[1];

            expect(Scheduler.queueNumber).toEqual(3);
            expect(Scheduler.customerQueue).toHaveLength(0);
            expect(Scheduler.vipCustomerQueue).toHaveLength(2);
            expect(Scheduler.currentCustomer).toBeUndefined();
            expect(firstCustomerInQueue?.name).toEqual(firstCustomer.name);
            expect(firstCustomerInQueue?.ticketNumber).toEqual(1);
            expect(firstCustomerInQueue?.isVIP).toBeTruthy();
            expect(secondCustomerInQueue?.name).toEqual(secondCustomer.name);
            expect(secondCustomerInQueue?.ticketNumber).toEqual(2);
            expect(secondCustomerInQueue?.isVIP).toBeTruthy();
        });

        test('should check in customers to either standard or VIP queue', () => {
            const Scheduler = retrieveScheduler();
            const firstCustomer: Record<string, string> = {
                name: 'john',
                number: '123456789',
            };
            const secondCustomer: Record<string, string> = {
                name: 'jane',
                number: '987654321',
            };
            Scheduler.checkIn(firstCustomer.name, firstCustomer.number, false);
            Scheduler.checkIn(secondCustomer.name, secondCustomer.number, true);
            const firstCustomerInQueue = Scheduler.customerQueue[0];
            const secondCustomerInQueue = Scheduler.vipCustomerQueue[0];

            expect(Scheduler.queueNumber).toEqual(3);
            expect(Scheduler.customerQueue).toHaveLength(1);
            expect(Scheduler.vipCustomerQueue).toHaveLength(1);
            expect(Scheduler.currentCustomer).toBeUndefined();
            expect(firstCustomerInQueue?.name).toEqual(firstCustomer.name);
            expect(firstCustomerInQueue?.ticketNumber).toEqual(1);
            expect(firstCustomerInQueue?.isVIP).toBeFalsy();
            expect(secondCustomerInQueue?.name).toEqual(secondCustomer.name);
            expect(secondCustomerInQueue?.ticketNumber).toEqual(2);
            expect(secondCustomerInQueue?.isVIP).toBeTruthy();
        });
    });

    describe('#addToQueue', () => {
        const mockName = 'john';
        const mockNumber = '123456789';
        const mockTicketNumber = 1;

        test('should add customer to standard queue', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                false
            );
            Scheduler.addToQueue(customer);
            expect(Scheduler.queueNumber).toEqual(2);
            expect(Scheduler.customerQueue).toHaveLength(1);
            expect(Scheduler.vipCustomerQueue).toHaveLength(0);
            expect(Scheduler.currentCustomer).toBeUndefined();
        });

        test('should add customer to VIP queue', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                true
            );
            Scheduler.addToQueue(customer);
            expect(Scheduler.queueNumber).toEqual(2);
            expect(Scheduler.customerQueue).toHaveLength(0);
            expect(Scheduler.vipCustomerQueue).toHaveLength(1);
            expect(Scheduler.currentCustomer).toBeUndefined();
        });
    });

    describe('#getNextCustomer', () => {
        const mockName = 'john';
        const mockNumber = '123456789';

        test('should retrieve the next customer from standard queue', () => {
            const Scheduler = retrieveScheduler();
            Scheduler.checkIn(mockName, mockNumber, false);
            const standardQueueCount = Scheduler.customerQueue.length;
            const nextCustomer = Scheduler.getNextCustomer();
            const currentCustomer = Scheduler.currentCustomer;

            expect(standardQueueCount).toEqual(1);
            expect(Scheduler.vipCustomerQueue).toHaveLength(0);
            expect(nextCustomer).toEqual(currentCustomer);
            expect(Scheduler.currentCustomer?.name).toEqual(mockName);
            expect(Scheduler.currentCustomer?.phoneNumber).toEqual(mockNumber);
            expect(Scheduler.currentCustomer?.isVIP).toBeFalsy();
            expect(Scheduler.currentCustomer).not.toBeUndefined();
            expect(Scheduler.numberOfCurrentVIPCustomersServed).toEqual(0);
        });

        test('should retrieve the next customer from VIP queue', () => {
            const Scheduler = retrieveScheduler();
            Scheduler.checkIn(mockName, mockNumber, true);
            const vipQueueCount = Scheduler.vipCustomerQueue.length;
            const nextCustomer = Scheduler.getNextCustomer();
            const currentCustomer = Scheduler.currentCustomer;

            expect(vipQueueCount).toEqual(1);
            expect(Scheduler.customerQueue).toHaveLength(0);
            expect(nextCustomer).toEqual(currentCustomer);
            expect(Scheduler.currentCustomer?.name).toEqual(mockName);
            expect(Scheduler.currentCustomer?.phoneNumber).toEqual(mockNumber);
            expect(Scheduler.currentCustomer?.isVIP).toBeTruthy();
            expect(Scheduler.currentCustomer).not.toBeUndefined();
            expect(Scheduler.numberOfCurrentVIPCustomersServed).toEqual(1);
        });

        test('should retrieve the next customer based on VIP priority', () => {
            const Scheduler = retrieveScheduler();
            Scheduler.checkIn('jane', '987654321', false);
            Scheduler.checkIn(mockName, mockNumber, true);
            const vipQueueCount = Scheduler.vipCustomerQueue.length;
            const nextCustomer = Scheduler.getNextCustomer();
            const currentCustomer = Scheduler.currentCustomer;

            expect(vipQueueCount).toEqual(1);
            expect(Scheduler.customerQueue).toHaveLength(1);
            expect(nextCustomer).toEqual(currentCustomer);
            expect(Scheduler.currentCustomer?.name).toEqual(mockName);
            expect(Scheduler.currentCustomer?.phoneNumber).toEqual(mockNumber);
            expect(Scheduler.currentCustomer?.isVIP).toBeTruthy();
            expect(Scheduler.currentCustomer).not.toBeUndefined();
            expect(Scheduler.numberOfCurrentVIPCustomersServed).toEqual(1);
        });
    });

    describe('#getServingQueue', () => {
        const mockVIPOutput = 'vip';
        const mockStandardOutput = 'customer';
        const mockName = 'john';
        const mockNumber = '123456789';
        const mockTicketNumber = 1;

        test('should return empty string if no customer scheduled', () => {
            const Scheduler = retrieveScheduler();
            expect(Scheduler.getServingQueue()).toEqual('');
        });

        test('should retrieve vip when vip should be processed', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                true
            );
            Scheduler.numberOfCurrentVIPCustomersServed++;
            Scheduler.addToQueue(customer);

            const response = Scheduler.getServingQueue();
            expect(response).toEqual(mockVIPOutput);
        });

        test('should retrieve customer when vip should not be processed', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                true
            );
            Scheduler.numberOfCurrentVIPCustomersServed = 2;
            Scheduler.addToQueue(customer);
            const response = Scheduler.getServingQueue();
            expect(response).toEqual(mockStandardOutput);
        });

        test('should retrieve customer when vip should not be processed and vip queue is empty', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                false
            );
            Scheduler.numberOfCurrentVIPCustomersServed = 2;
            Scheduler.addToQueue(customer);

            const response = Scheduler.getServingQueue();
            expect(response).toEqual(mockStandardOutput);
        });

        test('should retrieve customer when vip should be processed and vip queue is empty', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                false
            );
            Scheduler.addToQueue(customer);

            const response = Scheduler.getServingQueue();
            expect(response).toEqual(mockStandardOutput);
        });
    });

    describe('#shouldServe', () => {
        const mockName = 'john';
        const mockNumber = '123456789';
        const mockTicketNumber = 1;

        test('should serve if standard queue has customer', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                false
            );
            Scheduler.addToQueue(customer);

            const response = Scheduler.shouldServe();
            expect(response).toBeTruthy();
        });

        test('should serve if vip queue has customer', () => {
            const Scheduler = retrieveScheduler();
            const customer = new Customer(
                mockName,
                mockNumber,
                mockTicketNumber,
                true
            );
            Scheduler.addToQueue(customer);

            const response = Scheduler.shouldServe();
            expect(response).toBeTruthy();
        });

        test('should not serve if no customer is scheduled', () => {
            const Scheduler = retrieveScheduler();
            const response = Scheduler.shouldServe();
            expect(response).toBeFalsy();
        });
    });

    describe('#shouldProcessVIP', () => {
        test('should process VIP customer', () => {
            const Scheduler = retrieveScheduler();
            expect(Scheduler.shouldProcessVIP()).toBeTruthy();
        });

        test('should not process VIP customer', () => {
            const Scheduler = retrieveScheduler();
            Scheduler.numberOfCurrentVIPCustomersServed = 2;
            expect(Scheduler.shouldProcessVIP()).toBeFalsy();
        });
    });
});
