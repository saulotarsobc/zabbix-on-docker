#! bash
docker network create -d bridge zabbix;

docker run -d --name zabbix-mysql \
    --restart always \
    -p 3306:3306 \
    -v ./docker/zabbix/mysql/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=secret \
    -e MYSQL_DATABASE=zabbix \
    -e MYSQL_USER=zabbix \
    -e MYSQL_PASSWORD=zabbix \
    --network=zabbix \
    mysql:8 \
    --character-set-server=utf8mb4 \
    --collation-server=utf8mb4_bin

# Agora instalaremos o conteiner docker Zabbix SNMP Trap.
docker run -d --name zabbix-snmptraps -t \
    --restart always \
    -p 162:1162/udp \
    -v ./docker/zabbix/snmptraps:/var/lib/zabbix/snmptraps:rw \
    -v ./docker/zabbix/mibs:/usr/share/snmp/mibs:ro \
    --network=zabbix \
    zabbix/zabbix-snmptraps;

# Agora vamos instalar o container Zabbix-Server.
docker run -d --name zabbix-server \
    --restart always \
    -p 10051:10051 \
    -e DB_SERVER_HOST="zabbix-mysql" \
    -e DB_SERVER_PORT="3306" \
    -e MYSQL_ROOT_PASSWORD="secret" \
    -e MYSQL_DATABASE="zabbix" \
    -e MYSQL_USER="zabbix" \
    -e MYSQL_PASSWORD="zabbix" \
    -e ZBX_ENABLE_SNMP_TRAPS="true" \
    --network=zabbix \
    --volumes-from zabbix-snmptraps \
    zabbix/zabbix-server-mysql;

# Instale o conteiner Zabbix-Web:
docker run -d --name zabbix-web \
    --restart always \
    -p 80:8080 \
    -e ZBX_SERVER_HOST="zabbix-server" \
    -e DB_SERVER_HOST="zabbix-mysql" \
    -e DB_SERVER_PORT="3306" \
    -e MYSQL_ROOT_PASSWORD="secret" \
    -e MYSQL_DATABASE="zabbix" \
    -e MYSQL_USER="zabbix" \
    -e MYSQL_PASSWORD="zabbix" \
    -e PHP_TZ="America/Sao_Paulo" \
    --network=zabbix \
    zabbix/zabbix-web-nginx-mysql;

# Agora vamos iniciar o container docker do Zabbix-Agent.
docker run --name zabbix-agent --network=zabbix --link zabbix-server:zabbix-server --privileged -d zabbix/zabbix-agent;