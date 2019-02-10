const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;
const redisMock = require('redis-mock');
const Redis = require('redis');
const chaiHttp = require('chai-http');
const server = require('../../src/server');

chai.use(chaiHttp);

const TEST_KEY = 'A94FI292J49FJ24';

// utility to make this easier
const httpRequest = function(method, endpoint, body) {
    return new Promise((resolve, reject) => {
        const request = chai.request(server);
        request[method](endpoint)
            .send(body)
            .end((err, res) => {
                request.close();
                if ((err)) {
                    return reject(err);
                } else {
                    return resolve(res);
                }
            });
    });
};

describe('When I call the store endpoint', () => {

    before(() => {
        sinon.stub(Redis, 'createClient').returns(redisMock.createClient());
    });

    after(() => {
        Redis.createClient.restore();
    });

    const TEST_SCENARIOS = [
        {
            description: 'Valid input should store the data and return a 200',
            input: {
                id: 'integration-test-1',
                encryption_key: TEST_KEY,
                value: 'Sample data'
            },
            expectedOutput: {
                statusCode: 200,
                body: {}
            }
        },
        {
            description: 'Without specifying an id',
            input: {
                encryption_key: TEST_KEY,
                value: 'Sample data'
            },
            expectedOutput: {
                statusCode: 400,
                body: [{ 'name': 'required', 'argument': 'id', 'stack': 'instance requires property "id"' }]
            }
        }
    ];

    TEST_SCENARIOS.forEach(scenario => {
        it(scenario.description, async() => {
            const res = await httpRequest('post', '/common', scenario.input);
            expect(JSON.stringify(res.body)).to.equal(JSON.stringify(scenario.expectedOutput.body));
            expect(res.statusCode).to.equal(scenario.expectedOutput.statusCode);

        });
    });
});

describe('When I call the store endpoint and then retrieve the data', () => {
    before(() => {
        sinon.stub(Redis, 'createClient').returns(redisMock.createClient());
    });

    describe('Storing multiple values', async() => {

        const NUMBER_OF_VALUES_TO_SEED = 50;

        // seed the data
        before(async() => {
            let promises = [];
            for(let i = 0; i < NUMBER_OF_VALUES_TO_SEED; i++) {
                promises.push(httpRequest('post', '/common', {
                    id: `wildcard-integration-test-${i}`,
                    encryption_key: TEST_KEY,
                    value: {
                        iteration: i
                    }
                }));
            }
            await Promise.all(promises);
        });

        it('When searching a wildcard we should get all of the results back', async() => {
            let promises = [];

            await Promise.all(promises);

            let result = await httpRequest('post', '/common/search', {
                id: 'wildcard-integration-test*',
                encryption_key: TEST_KEY
            });
            expect(result.body.length).to.equal(NUMBER_OF_VALUES_TO_SEED);
        });
    });
});

after(() => {
    server.close();
});