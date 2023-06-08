import path from 'path';
import { pendingQueueParser } from '@src/utils/pendingQueueParser';

const pendingQueuePath = path.resolve(
    process.cwd(),
    'test',
    'resources',
    'pending_queue.csv'
);
const emptyQueue = path.resolve(
    process.cwd(),
    'test',
    'resources',
    'empty_pending_queue.csv'
);

describe('#pendingQueueParser', () => {
    test('should parse pending queue customers', async () => {
        const response = await pendingQueueParser(pendingQueuePath);
        const expectedResponse: Array<string[]> = [
            ['john', '123456789', 'true'],
            ['jane', '0987654321', 'false'],
        ];
        expect(response).toEqual(expectedResponse);
    });

    test('should parse empty pending queue', async () => {
        const response = await pendingQueueParser(emptyQueue);
        const expectedResponse: Array<string[]> = [];
        expect(response).toEqual(expectedResponse);
    });
});
