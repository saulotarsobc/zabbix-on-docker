FROM zabbix/zabbix-server-mysql:latest

# Server=zabbix-server
# ServerActive=zabbix-server
# Hostname=zabbix-agent
# RUN echo "Server=zabbix-server" >> /etc/zabbix/zabbix_server.conf;
# RUN echo "ServerActive=zabbix-server" >> /etc/zabbix/zabbix_server.conf;
# RUN echo "Hostname=zabbix-agent" >> /etc/zabbix/zabbix_server.conf;


# Copie arquivos de configuração personalizados, se houver
# COPY ./path/to/your/custom/config /etc/zabbix/

# Exponha a porta que o Zabbix Server usa
EXPOSE 10051

# travar o terminal
CMD [ "tail -f /dev/null" ]
