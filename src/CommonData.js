const RedisDatastore = require('./RedisDatastore');

module.exports = function(datastore = RedisDatastore, crypto) {

    this.findAll = async function(search) {
        const results = await RedisDatastore.findAll(search);

        return results.map(result => {

            const body = JSON.parse(result.body);

            if(!crypto.compareSecretHash(body.hash)) {
                console.log('MISMATCH');
                
                return;
            }

            const decrypted = crypto.decrypt(body.data);

            return {
                id: result.id,
                body: JSON.parse(decrypted)
            };
        }).filter(i => !!i);
    };

    this.store = async function(id, body) {
        const encrypted = crypto.encrypt(JSON.stringify(body));

        const storageBody = {
            hash: crypto.getSecretHash(),
            data: encrypted
        };

        return await RedisDatastore.create(id, JSON.stringify(storageBody));
    };
};
