const snmp = require('net-snmp');
const client = require('./db/db_client');
const child_process = require('child_process');

// Helper function which returns the disc usage for the given path
const getDiscUsage = (path) => {
    try {
        return Number(child_process.execSync(`du -s -B1 ${path} | tr -d -c 0-9`));
    } catch (error) {
        console.log(error);
    }
}

// Helper function which returns the latest signal value based on time
const getLatestSignalValue = () => {
    try {
        const result = client.querySync('SELECT "signalValue" FROM "snmpSignals" WHERE "signalTime" = (SELECT MAX("signalTime") FROM "snmpSignals")');
        return Number(result[0].signalValue);
    } catch (error) {
        console.log(error);
    }
}

//  Default options for passing as a parameter to createSubAgent()
//  although it is optional
const options = {
    master: 'localhost', // the host name or IP address of the master agent, which the subagent connects to.
    masterPort: 705, // the TCP port for the subagent to connect to the master agent on - defaults to 705.
    timeout: 0, // set the session-wide timeout on the master agent - defaults to 0, which means no session-wide timeout is set.
    description: 'Node net-snmp AgentX sub-agent', //  a textual description of the subagent
};

// The createSubagent () function instantiates and returns an instance of the Subagent class
const subagent = snmp.createSubagent(options);

// Returns the agent's singleton Mib instance, which is automatically created on creation of the subagent, 
// and which holds all of the management data for the subagent.
const mib = subagent.getMib();

// Sends an Open PDU to the master agent to open a new session, 
// invoking the callback on response from the master.
subagent.open((error, response) => {
    if (error) {
        console.log(error); // if any error occurs, we will log the error 
    } else {
        // This 'registerProvider()' sends a Register PDU to the master to register a region of the MIB
        // for which the master will send "request processing" PDUs to the subagent.
        subagent.registerProvider({
            name: 'software_version',
            type: snmp.MibProviderType.Scalar,
            oid: '1.3.6.1.4.1.53864.1.1.1',  // OID 1
            scalarType: snmp.ObjectType.OctetString,
            handler: (mibRequest) => {
                mibRequest.done();
            }
        }, null);
        subagent.getMib().setScalarValue('software_version', '6.1.1'); // set static value '6.1.1' as per requirement

        subagent.registerProvider({
            name: 'latest_signal_value',
            type: snmp.MibProviderType.Scalar,
            oid: '1.3.6.1.4.1.53864.1.2.1', // OID 2
            scalarType: snmp.ObjectType.Integer,
            handler: (mibRequest) => {
                mib.setScalarValue('latest_signal_value', getLatestSignalValue());
                mibRequest.done();
            }
        }, null);
        subagent.getMib().setScalarValue('latest_signal_value', getLatestSignalValue());

        subagent.registerProvider({
            name: 'disk_usage',
            type: snmp.MibProviderType.Scalar,
            oid: '1.3.6.1.4.1.53864.1.3.1', // OID 3
            scalarType: snmp.ObjectType.Integer,
            handler: (mibRequest) => {
                mib.setScalarValue('disk_usage', getDiscUsage('/var/log'));
                mibRequest.done();
            }
        }, null);
        subagent.getMib().setScalarValue('disk_usage', getDiscUsage('/var/log'));
        console.log('Custom agent service started...');
    }
});