const Client = require('pg-native');
require('dotenv').config();
const client = new Client();

try {
    client.connectSync();
} catch (error) {
    console.log(error);
}

module.exports = client;