import { NullableDisplayPipe } from './nullable-display.pipe';

describe('NullableDisplayPipe', () => {
    const testCases = [
        { input: null, expected: '-' },
        { input: undefined, expected: '-' },
        { input: 1, expected: 1 },
        { input: 'abc', expected: 'abc' },
        { input: 'null', expected: 'null' },
        { input: new Date(2023, 1, 1, 1, 1), expected: new Date(2023, 1, 1, 1, 1) }
    ];

    testCases.forEach(({ input, expected }) => {
        it(`should return ${expected} when input is ${input}`, () => {
            const pipe = new NullableDisplayPipe();
            expect(pipe.transform(input)).toEqual(expected);
        });
    });
});
