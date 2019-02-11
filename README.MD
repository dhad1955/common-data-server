# Common data server

A simple server to store and retrieve encrypted data

## Installation

Since this comes with redis as a dependency, it's advised to use the supplied docker files to build a docker environment to run the server.

```bash
docker-compose build && docker-compose up
```

If you do not want to use docker, you can run it locally but must have redis installed and running.

```bash
npm install
node index
```

## Running tests

```bash
npm install
npm test
```

## Storing a value 
POST http://localhost:3000/common
```
{
 "encryption_key": "Your passphrase",
 "value": "Your value",
 "id": "Your specified id"
 }
```

## Retrieiving a value
POST http://localhost:3000/common/search
```
{
 "encryption_key": "Your passphrase",
 "id": "Your specified id"
 }
```

Wildcards can be specified on id.
