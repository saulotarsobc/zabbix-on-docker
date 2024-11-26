var AzureStorage = {
    params: {},

    setParams: function (params) {
        ['token', 'id'].forEach(function (field) {
            if (typeof params !== 'object' || typeof params[field] === 'undefined' || params[field] === '') {
                throw 'Required param is not set: ' + field + '.';
            }
        });

        AzureStorage.params = params;
    },

    request: function (url) {
        var response, request = new HttpRequest();
        if (typeof AzureStorage.params.proxy !== 'undefined' && AzureStorage.params.proxy !== '') {
            request.setProxy(AzureStorage.params.proxy);
        }
        request.addHeader('Accept: application/json');
        request.addHeader('Authorization: Bearer ' + AzureStorage.params.token);
        // Zabbix.log(4, '[ Azure ] Sending request: ' + url);
        response = request.get(url);
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
                throw 'Required field was not found: ' + path + ' input data: ' + JSON.stringify(data);
            }

            data = data[step];
        }

        return data;
    },

    getMetricsData: function () {
        var data = {};
        start_date = new Date((new Date().getTime()) - 4200000).toISOString().replace(/\.\d+/, '');
        end_date = new Date((new Date().getTime()) - 600000).toISOString().replace(/\.\d+/, '');
        endpoints = {
            'tableServices': '/tableServices/default/providers/Microsoft.Insights/metrics?metricnames=TableCapacity,TableCount,TableEntityCount,Transactions,Ingress,Egress,SuccessServerLatency,SuccessE2ELatency,Availability&api-version=2021-05-01&interval=PT1H&timespan=' + encodeURIComponent(start_date) + '/' + encodeURIComponent(end_date),
            'blobServices': '/blobServices/default/providers/Microsoft.Insights/metrics?metricnames=BlobCapacity,BlobCount,ContainerCount,IndexCapacity,Transactions,Ingress,Egress,SuccessServerLatency,SuccessE2ELatency,Availability&api-version=2021-05-01&interval=PT1H&timespan=' + encodeURIComponent(start_date) + '/' + encodeURIComponent(end_date),
            'fileServices': '/fileServices/default/providers/Microsoft.Insights/metrics?metricnames=FileCapacity,FileCount,FileShareCount,FileShareSnapshotCount,FileShareSnapshotSize,FileShareCapacityQuota,Transactions,Ingress,Egress,SuccessServerLatency,SuccessE2ELatency,Availability&api-version=2021-05-01&interval=PT1H&timespan=' + encodeURIComponent(start_date) + '/' + encodeURIComponent(end_date),
            'storageAccount': '/providers/Microsoft.Insights/metrics?metricnames=UsedCapacity,Transactions,Ingress,Egress,SuccessServerLatency,SuccessE2ELatency,Availability&api-version=2021-05-01&interval=PT1H&timespan=' + encodeURIComponent(start_date) + '/' + encodeURIComponent(end_date),
            'queueServices': '/queueServices/default/providers/Microsoft.Insights/metrics?metricnames=QueueCapacity,QueueCount,QueueMessageCount,Transactions,Ingress,Egress,SuccessServerLatency,SuccessE2ELatency,Availability&api-version=2021-05-01&interval=PT1H&timespan=' + encodeURIComponent(start_date) + '/' + encodeURIComponent(end_date)
        };

        Object.keys(endpoints).forEach(function (field) {
            data[field] = {};
            metrics = AzureStorage.request('https://management.azure.com' + AzureStorage.params.id + endpoints[field]);

            if (!metrics.hasOwnProperty('value')) {
                throw 'Failed getting required field. Check debug log for more information.';
            }

            for (k in metrics.value) {
                key = AzureStorage.getField(metrics.value[k], 'name.value')
                if (metrics.value[k].timeseries.length === 0) {
                    metrics.value[k].timeseries.push({ 'data': ['nodata'] })
                }
                data[field][key] = AzureStorage.getField(metrics.value[k], 'timeseries.0.data.0');
            }
        });
        return data
    }

};

try {
    AzureStorage.setParams(JSON.parse(value));
    return JSON.stringify(AzureStorage.getMetricsData());
}
catch (error) {
    error += (String(error).endsWith('.')) ? '' : '.';
    // Zabbix.log(3, '[ Azure ] ERROR: ' + error);
    return JSON.stringify({ 'error': error });
}