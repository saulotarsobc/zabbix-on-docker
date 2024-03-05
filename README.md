# Zabbix on Docker

## Help

## [zabbix/zabbix-web-apache-mysql](https://hub.docker.com/r/zabbix/zabbix-web-apache-mysql)

- `ZBX_SERVER_HOST`: *This variable is IP or DNS name of Zabbix server. By default, value is zabbix-server.*
- `ZBX_SERVER_PORT`: *This variable is port Zabbix server listening on. By default, value is 10051.*
- `DB_SERVER_HOST`: *This variable is IP or DNS name of MySQL server. By default, value is 'mysql-server'.This variable is port of MySQL server. By default, value is '3306'.*
- `DB_SERVER_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_USER_FILE` and `MYSQL_PASSWORD_FILE`: *These variables are used by Zabbix web-interface to connect to Zabbix database. With the _FILE variables you can instead provide the path to a file which contains the user / the password instead. Without Docker Swarm or Kubernetes you also have to map the files. Those are exclusive so you can just provide one type - either MYSQL_USER or MYSQL_USER_FILE!*

## [zabbix/zabbix-server-mysql](https://hub.docker.com/r/zabbix/zabbix-server-mysql)

- `DB_SERVER_HOST`: *This variable is IP or DNS name of MySQL server. By default, value is 'mysql-server'*
- `DB_SERVER_PORT`: *This variable is port of MySQL server. By default, value is '3306'.*
- `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_USER_FILE` and `MYSQL_PASSWORD_FILE`: *These variables are used by Zabbix server to connect to Zabbix database. With the _FILE variables you can instead provide the path to a file which contains the user / the password instead. Without Docker Swarm or Kubernetes you also have to map the files. Those are exclusive so you can just provide one type - either MYSQL_USER or MYSQL_USER_FILE!*