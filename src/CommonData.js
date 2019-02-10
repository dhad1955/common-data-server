const RedisDatastore = require('./RedisDatastore');

module.exports = function(datastore = RedisDatastore, crypto) {

    this.findAll = async function(search) {
        const results = await RedisDatastore.findAll(search);

        return results.map(result => {

            const body = JSON.parse(result.body);

            /*
             * We store a the key (Hashed) in the record
             * We can then compare it with what the end user has supplied
             * To determine if it was correct or not otherwise we would be relying on checking if the data is corrupt
             * Another way to do it would be to do an MD5 of the data it self and compare it. Six and two threes really.
             */
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
