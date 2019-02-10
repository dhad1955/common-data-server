const crypto = require('crypto');
const ALGORITHM = 'aes-256-ctr';
const SECRET_LENGTH_MIN = 6;
const bcrypt = require('bcrypt');

const AES256Crypto = function(secret) {
    if (!secret || typeof secret !== 'string') {
        throw new Error('Secret must be of type \'string\'');
    }

    if(secret.length < SECRET_LENGTH_MIN) {
        throw new Error(`Secret must have minimum length of ${SECRET_LENGTH_MIN}`);
    }

    const key = crypto
        .createHash('sha256')
        .update(String(secret))
        .digest();

    this.getSecretHash = function()  {
        return bcrypt.hashSync(secret, 2);
    };

    this.compareSecretHash = function(encryptedSecret) {
        return bcrypt.compareSync(secret, encryptedSecret);
    };

    this.encrypt = function(value) {
        if(typeof value !== 'string') {
            throw new Error('Text must be of type \'string\'');
        }

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = cipher.update(String(value), 'utf8', 'hex') + cipher.final('hex');
        
        return iv.toString('hex') + encrypted;
    };

    this.decrypt = function(value) {
        if(typeof value !== 'string') {
            throw new Error('Text must be of type \'string\'');
        }

        const stringValue = String(value);
        const iv = Buffer.from(stringValue.slice(0, 32), 'hex');
        const encrypted = stringValue.slice(32);
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    };
};

module.exports = AES256Crypto;