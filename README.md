# SNMP_AfintiTest
Solution for task to set up an SNMP agent along with custom enterprise OIDs on a Linux server to be monitored.

## Design

I didn't had any previous knowledge about SNMP Protocol nor any prior experience working on it. The hardest part of this task was to understand deeply, how SNMP actually works behind the scenes. So, it took me almost 6-7 hours of research to understand how SNMP works, what is MIB and OIDs etc.
After the research, I decided to extend the 'net-snmp' module to add sub-agents to expose custom enterprise OIDs. This module is available in many programming languages. My choice for the solution was JavaScript due to several reasons.
1) JavaScript have a strong community support, you can find the solutions to your problems if you get stuck somewhere.
2) 'net-snmp' package for JavaScript was available to work with. 
3) I have vast experience working with JavaScript and I find it pretty comfortable to code in JavaScript.
Although, JavaScript is not the best choice for solving this problem, as compared to some languages such as C, C++ and Shell. But in our case, we can barely see any difference due to the language.  


## Tasks 


| Tasks           |Time spent on each task                                    
|----------------|--------------------------------------------------------
|Research|    8 hours                 
|Installation and configuration of Ubuntu          | 1 hour          
|Learning and configuration of PostgreSQL          | 1.5 hours
|Installation and set up snmp and other dependencies          | 1.5 hours
|Development of solution           | 6 hours
|Learning and configuration of PostgreSQL          | 2 hours

****I faced lots of issues and problems while configuring snmp, fixing those issue took hours of research and debugging, which I didn't mentioned**


## Custom OIDs
- **1.3.6.1.4.1.53864.1.1.1** ( return a string denoting the version number of a software that runs on the system ) 
 
- **1.3.6.1.4.1.53864.1.2.1** ( query a Postgres table named ‘snmpSignals’ in a database named ‘afinitiTest’ and return the latest value of the column ‘signalValue’ as determined by the timestamp column ‘signalTime’ )

- **1.3.6.1.4.1.53864.1.3.1** ( return the total disk space used (in bytes) for the /var/log/ folder )


## Installation guide

- First of all, we need to install SNMP, run the following commands in your terminal:  <br>
	**sudo apt-get update** <br>
	**sudo apt install snmp snmpd snmp-mibs-downloader**
	
- Then, the next step is to install PostgreSQL, run the following commands in your terminal: <br>
	**sudo apt-get update** <br>
	**sudo apt install postgresql postgresql-contrib libpq-dev**

- Find the file [NET-SNMP-CUSTOM-MIB.txt](https://github.com/umershaikh97/SNMP_AfintiTest/blob/master/config/NET-SNMP-CUSTOM-MIB.txt "NET-SNMP-CUSTOM-MIB.txt") in the directory: **SNMP_AfintiTest/config/NET-SNMP-CUSTOM-MIB.txt** and copy/cut this file
and  paste the file in this **/usr/share/snmp/mibs** directory.

- Open directory **/etc/snmp/** and replace the content of the file **snmp.conf** with:  <br>
		`mibs +NET-SNMP-CUSTOM-MIB`  <br>
	and replace the content of the file **snmpd.conf** with:   <br>
		`rocommunity public 127.0.0.1 .1`  <br>
		`master agentx`  <br>
		`agentXSocket    tcp:localhost:705`  <br>

- As we have updated the MIBs and changed the configuration, so we need to restart the snmpd service to run with updated configurations, we can do this by simply running the command:  <br>
**sudo service snmpd restart**	

- Install Node to run the project, by running the command:  <br>
**sudo apt install nodejs**

- After cloning or downloading the attached project, go to the root directory of the project and install the dependencies by running the command:   <br>
**sudo npm install**	

- Then create a .env file in the root directory of the project to set environment variables according to your database, your .env file must include following environment variables: 
	
	**PGHOST=hostAddress  <br>
	PGPORT=hostPort  <br>
	PGUSER=userName  <br>
	PGPASSWORD=password  <br>
	PGDATABASE=databaseName**  <br>	
	
	In my case, .env file had the following content:
	
	**PGHOST=127.0.0.1  <br>
PGPORT=5432  <br>
PGUSER=postgres  <br>
PGPASSWORD=12345  <br>
PGDATABASE=afinitiTest**  <br>

- Now, we need to run migrations to populate the database, by running the following command in the root directory of the project:   <br>
**node db/migration.js** <br>
you should see the message **Migration Successful** in the console.

- Now, the final step is to run our **index.js** , by running the following command in the root directory of the project:  <br>
**sudo node index.js**	<br>
you should see the message **custom agent service started...** in the console.

## Testing

I tested the sub agent on the custom OIDs, by running **snmpwalk** and **snmpget** commands, the syntax for these commands is: <br>
- snmpget -v [snmpVersion] -c [communityString] [hostAddress] [oid] <br>
- snmpwalk -v [snmpVersion] -c [communityString] [hostAddress] [oid] <br>

So for our custom OIDs, typical snmpget command would be: <br><br>
**snmpget -v 2c -c public localhost 1.3.6.1.4.1.53864.1.1.1.0** <br>**Output:** NET-SNMP-CUSTOM-MIB::swVersionString.0 = STRING: "6.1.1"<br><br>
**We need to add **.0** at the end of our OID, as it is scalar type, So don't forget to add **.0** at the end of custom OID.

## Other approaches

As I mentioned earlier, JavaScript is not the best choice for these types of tasks, so on large scale, we will get better results from C, C++, C# or Shell in terms of performance and time complexity. While for this limited solution, we can barely see any difference. 

## Note

I also tried to build similar custom SNMP agent component for windows machine, without using any 3rd party library or package. You can view this [SNMP-NodeJS](https://github.com/umershaikh97/SNMP-NodeJS) repository too. It is not an actual SNMP agent, rather it is just a representation of an agent.

