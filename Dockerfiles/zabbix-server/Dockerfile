FROM zabbix/zabbix-server-mysql:ubuntu-latest

COPY zabbix_server.conf /etc/zabbix/zabbix_server.conf

USER root

RUN apt update;
RUN apt upgrade -y;
# RUN apt install libcurl4t64=8.5.0-2ubuntu10 -y;
# RUN apt install curl=8.5.0-2ubuntu10 -y;

EXPOSE 10051

