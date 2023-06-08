/**
 * Customer class to record customers information
 */
export default class Customer {
    name: string;
    phoneNumber: string;
    isVIP: boolean;
    ticketNumber: number;

    constructor(
        name: string,
        phoneNumber: string,
        ticketNumber: number,
        isVIP = false
    ) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.isVIP = isVIP;
        this.ticketNumber = ticketNumber;
    }
}
