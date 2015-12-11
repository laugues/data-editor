'use strict';

angular.module('MLEditor')
    .factory('RequestService', [
        '$http',
        '$base64',
        'globalConstants',
        '$rootScope',
        '$translate',
        'CommonService',
        function ($http,$base64, globalConstants, $rootScope, $translate, CommonService) {

            var RequestService = {
                doPost: _doPostRequest,
                doGet: _doGetRequest,
                buildServiceUrl: _buildServiceUrl,
                buildErrorResponseAlertText : _buildErrorResponseAlertText
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
                return CommonService.getRootUrl() + endUrl;
            }


            function _buildRequestHeader(authorization) {
                var headers = {};

                if (typeof authorization !== 'undefined' && authorization != '') {

                    headers["Authorization"] = 'Basic ' + authorization;
                }

                //Prevent IE cache problems
                headers["Pragma"] = "no-cache";
                headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                return headers;
            }

            function _buildErrorResponseAlertText(response) {
                var text = '';

                if(response.data == null) {
                    var serverErrror = $translate.instant('UNEXPECTED_SERVER_ERROR');
                    text =
                        $translate.instant('ERROR_CODE', response.status) + " </br>" +
                        $translate.instant('ERROR_MESSAGE', serverErrror) + " </br>";
                } else {
                    var errorResponse = _getErrorResponse(response);
                    if (typeof errorResponse !== 'undefined' && errorResponse != '' && errorResponse != null) {
                        var errorStatusCode = {value: _getErrorResponseStatusCode(response)};
                        var errorStatus = {value: _getErrorResponseStatus(response)};
                        var errorMessageCode = {value: _getErrorResponseMessageCode(response)};
                        var errorMessage = {value: _getErrorResponseMessage(response)};

                        text =
                            $translate.instant('ERROR_CODE', errorStatusCode) + " </br>" +
                            $translate.instant('ERROR_STATE', errorStatus) + " </br>" +
                            $translate.instant('ERROR_MESSAGE_CODE', errorMessageCode) + " </br>" +
                            $translate.instant('ERROR_MESSAGE', errorMessage) + " </br>";
                    } else {
                        text = _getResponseData(response);
                    }
                }
                return text;
            }


            function _buildResultResponseAlertText(response) {
                var text = _getResponseData(response);
                return text;
            }

            function _getResponseData(response) {
                return response.data;
            };
            function _getErrorResponse(response) {
                return response.data.errorResponse;
            };

            function _getErrorResponseStatusCode(response) {
                return _getErrorResponse(response).statusCode;
            };

            function _getErrorResponseStatus(response) {
                return _getErrorResponse(response).status;
            };

            function _getErrorResponseMessageCode(response) {
                return _getErrorResponse(response).messageCode;
            };

            function _getErrorResponseMessage(response) {
                return _getErrorResponse(response).message;
            };


            return RequestService;
        }
    ]);