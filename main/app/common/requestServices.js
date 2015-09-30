'use strict';

itesoftMlEditor.factory('RequestService', ['$http', 'globalConstants', '$rootScope',
    function ($http, globalConstants, $rootScope) {

        var RequestService = {
            doPost: _doPostRequest,
            doGet: _doGetRequest,
            buildServiceUrl: _buildServiceUrl
        };

        function _doGetRequest(url, parameters) {
            return $http(
                {
                    method: 'GET',
                    url: url,
                    headers: _buildRequestHeader($rootScope.basicAuthenticationValue),
                    params: parameters
                });
        }

        function _doPostRequest(url, content, parameters) {
            return $http(
                {
                    method: 'POST',
                    url: url,
                    data: content,
                    headers: _buildRequestHeader($rootScope.basicAuthenticationValue),
                    params: parameters
                });
        }

        function _buildServiceUrl(endUrl) {
            return globalConstants.DATA_SERVER_CONNECTION + endUrl;
        }


        function _buildRequestHeader(authorization) {
            var headers = {};

            if (typeof authorization !== 'undefined' && authorization != '') {
                headers["Authorization"] = authorization;
            }

            headers["Pragma"] = "no-cache";
            headers["Cache-Control"] = "no-cache, no-store, must-revalidate";

            return headers;
        }

        return RequestService;
    }
]);