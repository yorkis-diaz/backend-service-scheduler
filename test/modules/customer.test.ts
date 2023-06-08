import Customer from '@src/modules/customer';

const mockName = 'john';
const mockPhoneNumber = '123456789';
const mockQueueNumber = 1;

describe('#Customer', () => {
    test('should instantiate customer class for regular customer', () => {
        const mockCustomer = new Customer(
            mockName,
            mockPhoneNumber,
            mockQueueNumber,
            false
        );
        expect(mockCustomer.name).toEqual(mockName);
        expect(mockCustomer.phoneNumber).toEqual(mockPhoneNumber);
        expect(mockCustomer.ticketNumber).toEqual(mockQueueNumber);
        expect(mockCustomer.isVIP).toBeFalsy();
    });

    test('should instantiate customer class for VIP customer', () => {
        const mockCustomer = new Customer(
            mockName,
            mockPhoneNumber,
            mockQueueNumber,
            true
        );
        expect(mockCustomer.name).toEqual(mockName);
        expect(mockCustomer.phoneNumber).toEqual(mockPhoneNumber);
        expect(mockCustomer.ticketNumber).toEqual(mockQueueNumber);
        expect(mockCustomer.isVIP).toBeTruthy();
    });
});
