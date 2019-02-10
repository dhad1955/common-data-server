let redis = require('redis');
require('dotenv').config();

let _client;

const _getClient = function() {
    if(!_client) {
        _client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_ENDPOINT);
    }
    
    return _client;
};

const find = function(id) {
    return new Promise((resolve, reject) => {
        _getClient().get(id, (err, res) => {
            if(!res) {
                reject({});
            } else {
                resolve(_decorate(id, (JSON.parse(res))));
            }
        });
    });
};

const create = function(id, body) {
    return new Promise((resolve, reject) => {
        _getClient().set(id,  body, ((err, result) => {
            if(err) {
                return reject(err);
            }
            
            return resolve(_decorate(id, body));
        }));

    });
};

const findAll = function(search) {
    return new Promise((resolve, reject) => {
        _getClient().keys(search, (err, keys) => {
            let output = [];
            let index = 0;
            // Asynchronous hell with node..
            let iterator = () => {
                // Operation finished
                if(index >= keys.length) {
                    resolve(output);
                    
                    return;
                }

                _getClient().get(keys[ index ], (err, res) => {
                    output.push(_decorate(keys[ index ], (res)));
                    index++;
                    iterator();
                });
            };
            iterator();
        });

    });
};

const _decorate = function(id, body) {

    return { id: id, body: body };
};

module.exports = { _getClient, _client, findAll, find, create, _decorate };