var Azure = {
    params: {},
    token: null,

    setParams: function (params) {
        ['app_id', 'password', 'tenant_id', 'subscription_id'].forEach(function (field) {
            if (typeof params !== 'object' || typeof params[field] === 'undefined' || params[field] === '') {
                throw 'Required param is not set: ' + field + '.';
            }
        });

        Azure.params = params;
    },

    request: function (url, data) {
        if (typeof data === 'undefined' || data === null) {
            data = '';
        }
        var response, request = new HttpRequest();
        if (typeof Azure.params.proxy !== 'undefined' && Azure.params.proxy !== '') {
            request.setProxy(Azure.params.proxy);
        }
        if (Azure.token) {
            request.addHeader('Accept: application/json');
            request.addHeader('Authorization: Bearer ' + Azure.token);
        }

        // Zabbix.log(4, '[ Azure ] Sending request: ' + url);

        if (data !== '') {
            request.addHeader('Content-Type: application/x-www-form-urlencoded');
            response = request.post(url, data);
        }
        else {
            response = request.get(url);
        }

        // Zabbix.log(4, '[ Azure ] Received response with status code ' + request.getStatus() + ': ' + response);

        if (request.getStatus() !== 200 || response === null) {
            throw 'Request failed with status code ' + request.getStatus() + ': ' + response;
        }

        try {
            return JSON.parse(response);
        }
        catch (error) {
            throw 'Failed to parse response received from API.';
        }
    },

    nextlink: function (data) {
        next_data = data;
        while ('nextLink' in next_data) {
            next_data = Azure.request(next_data.nextLink);
            next_data.value.forEach(function (value) {
                data.value.push(value);
            });
        }

        return data;
    }
};

var result,
    data = {},
    types = [
        { "method": "Microsoft.Compute/virtualMachines", "version": "2022-03-01" },
        { "method": "Microsoft.DBforMySQL/flexibleServers", "version": "2021-05-01" },
        { "method": "Microsoft.DBforMySQL/servers", "version": "2017-12-01" },
        { "method": "Microsoft.DBforPostgreSQL/flexibleServers", "version": "2021-06-01" },
        { "method": "Microsoft.DBforPostgreSQL/servers", "version": "2017-12-01" },
        { "method": "Microsoft.Sql/servers", "version": "2022-05-01-preview" },
        { "method": "Microsoft.DocumentDB/databaseAccounts", "version": "2022-11-15-preview" },
        { "method": "Microsoft.Compute/virtualMachineScaleSets", "version": "2024-03-01" }
    ];
data['errors'] = {},
    data['resources'] = {};
data.resources.value = [];

try {
    Azure.setParams(JSON.parse(value));

    try {
        result = Azure.request(
            'https://login.microsoftonline.com/' + encodeURIComponent(Azure.params.tenant_id) + '/oauth2/token',
            'grant_type=client_credentials&resource=' + encodeURIComponent('https://management.azure.com/') + '&client_id=' + encodeURIComponent(Azure.params.app_id) + '&client_secret=' + encodeURIComponent(Azure.params.password)
        );

        if ('access_token' in result) {
            Azure.token = result['access_token'];
        } else {
            throw 'Auth response does not contain access token.';
        }
    }
    catch (error) {
        data.errors.auth = error.toString();
    }

    if (!('auth' in data.errors)) {
        try {
            for (var i in types) {
                if (types[i].method === "Microsoft.Sql/servers") {
                    mssql_servers = Azure.request('https://management.azure.com/subscriptions/' + encodeURIComponent(Azure.params.subscription_id) + '/providers/' + types[i].method + '?api-version=' + types[i].version);

                    if ('nextLink' in mssql_servers) {
                        mssql_servers = Azure.nextlink(mssql_servers);
                    }

                    if ('value' in mssql_servers && mssql_servers.value.length > 0) {
                        for (j in mssql_servers.value) {
                            mssql_dbs = Azure.request('https://management.azure.com' + mssql_servers.value[j].id + '/databases?api-version=' + types[i].version);

                            if ('nextLink' in mssql_dbs) {
                                mssql_dbs = Azure.nextlink(mssql_dbs);
                            }

                            mssql_dbs.value.forEach(function (value) {
                                raw_data.value.push(value);
                            });
                        }
                    }
                }
                else {
                    raw_data = Azure.request('https://management.azure.com/subscriptions/' + encodeURIComponent(Azure.params.subscription_id) + '/providers/' + types[i].method + '?api-version=' + types[i].version);

                    if ('nextLink' in raw_data) {
                        raw_data = Azure.nextlink(raw_data);
                    }
                }

                raw_data.value.forEach(function (value) {
                    value.resourceGroup = value.id.split("/")[4];
                    data.resources.value.push(value);
                });
            }
        }
        catch (error) {
            data.errors.resources = error.toString();
        }
    }
}
catch (error) {
    data.errors.params = error.toString();
}

if (Object.keys(data.errors).length !== 0) {
    errors = 'Failed to receive data:';
    for (var error in data.errors) {
        errors += '\n' + error + ' : ' + data.errors[error];
    }
    data.errors = errors;
}
else {
    data.errors = '';
}

return JSON.stringify(data);