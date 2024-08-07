FROM zabbix/zabbix-agent:ubuntu-latest

COPY zabbix_agentd.conf /etc/zabbix/zabbix_agentd.conf

USER root

RUN apt update;
RUN apt upgrade -y;
# RUN apt install libcurl4t64=8.5.0-2ubuntu10 -y;
# RUN apt install curl=8.5.0-2ubuntu10 -y;

EXPOSE 10050