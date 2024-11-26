var Azure = {
    params: {},
    token: '',

    setParams: function (params) {
        ['app_id', 'password', 'tenant_id', 'subscription_id'].forEach(function (field) {
            if (typeof params !== 'object' || typeof params[field] === 'undefined' || params[field] === '') {
                throw 'Required param is not set: ' + field + '.';
            }
        });

        Azure.params = params;
    },

    login: function () {
        var response, login = new HttpRequest();
        if (typeof Azure.params.proxy !== 'undefined' && Azure.params.proxy !== '') {
            login.setProxy(Azure.params.proxy);
        }
        login.addHeader('Content-Type: application/x-www-form-urlencoded');
        response = login.post(
            'https://login.microsoftonline.com/' + encodeURIComponent(Azure.params.tenant_id) + '/oauth2/token',
            'grant_type=client_credentials&resource=' + encodeURIComponent('https://management.azure.com/') + '&client_id=' + encodeURIComponent(Azure.params.app_id) + '&client_secret=' + encodeURIComponent(Azure.params.password)
        );

        if (login.getStatus() !== 200) {
            throw 'Login failed with status code ' + login.getStatus() + ': ' + response;
        }
        try {
            response = JSON.parse(response);
            if (!response.hasOwnProperty('access_token')) {
                throw null;
            }
        }
        catch (error) {
            throw 'Authentication response does not contain access token.';
        }

        Azure.token = response['access_token'];
    },

    request: function (url) {
        var response, request = new HttpRequest();
        if (typeof Azure.params.proxy !== 'undefined' && Azure.params.proxy !== '') {
            request.setProxy(Azure.params.proxy);
        }
        if (!Azure.token) {
            throw 'Request does not contain access token.';
        }
        request.addHeader('Accept: application/json');
        request.addHeader('Authorization: Bearer ' + Azure.token);
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
                throw 'Required field was not found: ' + path;
            }

            data = data[step];
        }

        return data;
    },

    getMetricsData: function () {
        var metric = Azure.request('https://management.azure.com/subscriptions/' + encodeURIComponent(Azure.params.subscription_id) + '/providers/Microsoft.Storage/storageAccounts?api-version=2021-05-01'),
            data = [];

        if (!metric.hasOwnProperty('value')) {
            throw 'Failed getting required field. Check debug log for more information.';
        }
        for (k in metric.value) {
            id = Azure.getField(metric.value[k], 'id');
            json = {};
            input = id.split('/');
            for (var i = 1; i < input.length; i += 2) {
                json[input[i]] = input[i + 1];
            }
            data.push({
                'name': Azure.getField(metric.value[k], 'name'),
                'id': id,
                'resourceGroup': Azure.getField(json, 'resourceGroups'),
                'location': Azure.getField(metric.value[k], 'location'),
                'token': Azure.token
            });
        }

        return data;
    }
};

try {
    Azure.setParams(JSON.parse(value));
    Azure.login();
    return JSON.stringify(Azure.getMetricsData());
}
catch (error) {
    error += (String(error).endsWith('.')) ? '' : '.';
    // Zabbix.log(3, '[ Azure ] ERROR: ' + error);
    return JSON.stringify({ 'error': error });
}