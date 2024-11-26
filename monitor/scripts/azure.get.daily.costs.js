var AzureCost = {
    params: {},
    token: null,

    setParams: function (params) {
        ['app_id', 'password', 'tenant_id', 'subscription_id'].forEach(function (field) {
            if (typeof params !== 'object' || typeof params[field] === 'undefined' || params[field] === '') {
                throw 'Required param is not set: ' + field + '.';
            }
        });
        AzureCost.params = params;
    },

    login: function () {
        var response,
            login = new HttpRequest();

        if (typeof AzureCost.params.proxy !== 'undefined' && AzureCost.params.proxy !== '') {
            login.setProxy(AzureCost.params.proxy);
        }

        login.addHeader('Content-Type: application/x-www-form-urlencoded');
        response = login.post(
            'https://login.microsoftonline.com/' + encodeURIComponent(AzureCost.params.tenant_id) + '/oauth2/token',
            'grant_type=client_credentials&resource=' + encodeURIComponent('https://management.azure.com/') + '&client_id=' + encodeURIComponent(AzureCost.params.app_id) + '&client_secret=' + encodeURIComponent(AzureCost.params.password)
        );

        if (login.getStatus() !== 200) {
            throw 'Login failed with status code ' + login.getStatus() + ': ' + response;
        }
        try {
            response = JSON.parse(response);
        }
        catch (error) {
            throw 'Failed to parse login session response.';
        }
        if (!response.hasOwnProperty('access_token')) {
            throw 'Authentication response does not contain access token.';
        }

        AzureCost.token = response['access_token'];
    },

    request: function (url, body) {
        if (typeof body === 'undefined' || body === null) {
            body = '';
        }
        var response,
            headers,
            regex = /-retry-after":"(\d+)"/,
            ratelimit,
            request = new HttpRequest();

        if (typeof AzureCost.params.proxy !== 'undefined' && AzureCost.params.proxy !== '') {
            request.setProxy(AzureCost.params.proxy);
        }
        if (!AzureCost.token) {
            throw 'Request does not contain access token.';
        }
        request.addHeader('Accept: application/json');
        request.addHeader('Content-Type: application/json');
        request.addHeader('Authorization: Bearer ' + AzureCost.token);

        // Zabbix.log(4, '[ AzureCost ] request url: ' + url);

        response = request.post(url, body);
        headers = JSON.stringify(request.getHeaders());

        if (headers.match(regex) !== null && request.getStatus() === 429) {
            ratelimit = headers.match(regex)[1];
            // Zabbix.log(4, '[ AzureCost ] Microsoft Cost Management have rate limit requests per 1 minute, retrying after ' + ratelimit + ' seconds');
            Zabbix.sleep(ratelimit * 1010);
            response = request.post(url, body);
        }
        if (request.getStatus() !== 200) {
            throw 'Request failed with status code ' + request.getStatus() + ': ' + response;
        }

        try {
            return JSON.parse(response);
        }
        catch (error) {
            throw 'Failed to parse response received from API.';
        }
    },

    getField: function (data, path) {
        var steps = path.split('.');
        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];
            if (typeof data !== 'object' || typeof data[step] === 'undefined') {
                throw 'Required field was not found: ' + path;
            }
            data = data[step];
        }

        return data;
    },

    getCost: function () {
        var metricData = {},
            today = new Date(),
            start_date = new Date(today);
        start_date.setDate(today.getDate() - 1);

        bodyRawCost = {
            type: 'Usage',
            'timeframe': 'Custom',
            'timePeriod': {
                'from': start_date,
                'to': start_date
            },
            dataset: {
                granularity: 'Daily',
                aggregation: {
                    totalCost: {
                        name: 'PreTaxCost',
                        function: 'Sum'
                    }
                },
                grouping: [
                    {
                        type: 'Dimension',
                        name: 'Meter',
                    },
                    {
                        type: 'Dimension',
                        name: 'MeterSubcategory',
                    },
                    {
                        type: 'Dimension',
                        name: 'ResourceGroup',
                    },
                    {
                        type: 'Dimension',
                        name: 'ServiceName',
                    },
                    {
                        type: 'Dimension',
                        name: 'ResourceLocation',
                    }
                ]
            }
        };
        metricData = AzureCost.request('https://management.azure.com/subscriptions/' + AzureCost.params.subscription_id + '/providers/Microsoft.CostManagement/query?api-version=2023-11-01', JSON.stringify(bodyRawCost));

        var columns = AzureCost.getField(metricData, 'properties.columns');

        return transformedData = {
            data: AzureCost.getField(metricData, 'properties.rows').map(function (row) {
                rowData = {};
                columns.forEach(function (column, i) {
                    columnName = columns[i].name;
                    columnType = columns[i].type;
                    cellValue = row[i];
                    rowData[columnName] = column.type === "Number" ? cellValue.toString() : cellValue;
                });
                rowData.UsageDate = rowData.UsageDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

                return rowData;
            })
        };
    }
};

try {
    AzureCost.setParams(JSON.parse(value));
    AzureCost.login();

    return JSON.stringify(AzureCost.getCost());
}
catch (error) {
    error += (String(error).endsWith('.')) ? '' : '.';
    // Zabbix.log(3, '[ AzureCost ] ERROR: ' + error);

    return JSON.stringify({ 'error': error });
}