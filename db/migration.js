const client = require('./db_client');

try {
    client.querySync('DROP TABLE IF EXISTS "snmpSignals";');
    client.querySync('CREATE TABLE public."snmpSignals" ( "id" int NOT NULL, "signalTime" time without time zone, "signalValue" int, PRIMARY KEY (id))');
    client.querySync('INSERT INTO "snmpSignals" values (1, \'01:23:30.24118\', 123); INSERT INTO "snmpSignals" values (2, \'23:00:00.2345\', 456); INSERT INTO "snmpSignals" values (3, \'22:20:23.72157\',999);');
    console.log('Migration successful!');
} catch (error) {
    console.log(error);
}