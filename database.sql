CREATE ROLE umershaikh WITH
	LOGIN
	SUPERUSER
	CREATEDB
	CREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'xxxxxx';


CREATE DATABASE "afinitiTest"
    WITH 
    OWNER = umershaikh
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;


CREATE TABLE public."snmpSignals"
(
    "id" int NOT NULL,
    "signalTime" time without time zone,
    "signalValue" int,
    PRIMARY KEY (id)
);

INSERT INTO public."snmpSignals" values (1, '01:23:30.24118', 123); 
INSERT INTO public."snmpSignals" values (2, '23:00:00.2345', 456); 
INSERT INTO public."snmpSignals" values (3, '22:20:23.72157',999);


ALTER TABLE public."snmpSignals" OWNER to umershaikh;