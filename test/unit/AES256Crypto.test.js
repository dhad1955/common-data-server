const expect = require('chai').expect;
const AES256Crypto = require('../../src/AES256Crypto');

const TEST_PASSWORD = Math.random().toString(36).substring(7);

describe('AES256Crypto', () => {
    describe('When I call the Constructor', () => {

        const TEST_CASES = [

            {
                input: 252525252,
                expectError: true,
                expectedOutput: 'Secret must be of type \'string\'',
                description: 'Should error for not specifying a string'
            },

            {
                input: ' ',
                expectError: true,
                expectedOutput: 'Secret must have minimum length of 6',
                description: 'Should error for not specifying a string'
            },

            {
                input: 'SomeRandomSecret',
                expectError: false,
                expectedOutput: undefined,
                description: 'Should be no error'
            }

        ];

        TEST_CASES.forEach(tc => {
            it(tc.description, () => {
                try {
                    const result = new AES256Crypto(tc.input);
                    if (tc.expectError) {
                        expect.fail(`Should have thrown an error ${tc.expectedOutput}`);
                    }
                    if(tc.expectedOutput) {
                        expect(result).to.equal(tc.expectedOutput);
                    }
                } catch (e) {
                    if (!tc.expectError) {
                        console.log(e);
                        expect.fail('Should not have thrown an error');
                    }

                    expect(e.message).to.equal(tc.expectedOutput);
                }
            });
        });
    });

    describe('When I call the encrypt function', () => {
        const Crypto = new AES256Crypto(TEST_PASSWORD);

        it('passing pass a non-string should result in an error', () => {
            expect(() => {
                Crypto.encrypt({ object: 1 });
            }).to.throw('Text must be of type \'string\'');
        });

        it('When I encrypt a string it should be able to be decrypted', () => {
            const INPUT = 'The quick brown fox';
            const encrypted = Crypto.encrypt(INPUT);
            expect(Crypto.decrypt(encrypted)).to.equal(INPUT);
        });
    });

});