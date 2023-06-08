/**
 * Main scheduler class to queue and serve customers
 */
import Customer from './customer';

export default class ServiceScheduler {
    customerQueue: Customer[];
    vipCustomerQueue: Customer[];
    queueNumber: number;
    currentCustomer: Customer | undefined;
    numberOfCurrentVIPCustomersServed: number;

    constructor() {
        this.customerQueue = [];
        this.vipCustomerQueue = [];
        this.queueNumber = 1;
        this.numberOfCurrentVIPCustomersServed = 0;
    }

    checkIn(name: string, phoneNumber: string, vipStatus = false): void {
        const ticket = this.queueNumber;
        let customer;

        if (vipStatus) {
            customer = new Customer(name, phoneNumber, ticket, vipStatus);
        } else {
            customer = new Customer(name, phoneNumber, ticket, vipStatus);
        }

        this.addToQueue(customer);
    }

    addToQueue(customer: Customer): void {
        customer.isVIP
            ? this.vipCustomerQueue.push(customer)
            : this.customerQueue.push(customer);
        this.queueNumber++;
    }

    getNextCustomer(): Customer | undefined {
        const servingQueue = this.getServingQueue();
        if (servingQueue === 'vip') {
            this.currentCustomer = this.vipCustomerQueue?.shift();
            this.numberOfCurrentVIPCustomersServed++;
            return this.currentCustomer;
        }

        if (!this.shouldProcessVIP())
            this.numberOfCurrentVIPCustomersServed = 0;
        this.currentCustomer = this.customerQueue?.shift();
        return this.currentCustomer;
    }

    getServingQueue(): string {
        if (!this.shouldServe()) return '';

        const shouldProcessVIP = this.shouldProcessVIP();

        if (shouldProcessVIP && this.vipCustomerQueue.length) {
            return 'vip';
        } else if (
            !shouldProcessVIP &&
            this.vipCustomerQueue.length &&
            this.customerQueue.length
        ) {
            return 'customer';
        } else if (!shouldProcessVIP && !this.vipCustomerQueue.length) {
            return 'customer';
        } else {
            return 'customer';
        }
    }

    shouldServe(): number {
        return this.customerQueue.length || this.vipCustomerQueue.length;
    }

    shouldProcessVIP(): boolean {
        return this.numberOfCurrentVIPCustomersServed < 2;
    }
}
