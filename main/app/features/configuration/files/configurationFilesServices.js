'use strict';

angular.module('MLEditor')
    .factory('ConfigurationFilesService', [
        'globalConstants',
        'RequestService',
    function (globalConstants, RequestService) {

        var InvoiceService = {
            search: _search,
            save: _save,
            get: _get,
            buildErrorResponseAlertText : _buildErrorResponseAlertText
        };


        function _search(mode) {
            var _url = RequestService.buildServiceUrl(globalConstants.CONFIGURATION_FILES.SEARCH.PATH);
            var _parameters = _buildSearchParam(globalConstants.DATA_DATABASE_NAME,mode);
            return RequestService.doGet(_url, _parameters);
        }


        function _save(elementType, content, uri) {
            var _url = RequestService.buildServiceUrl(globalConstants.CONFIGURATION_FILES.SAVE.PATH);
            var _parameters = _buildSaveParam(elementType, uri);
            return RequestService.doPost(_url, content, _parameters);
        }


        function _get(uri, mode) {
            var _url = RequestService.buildServiceUrl(globalConstants.CONFIGURATION_FILES.GET.PATH);
            var _parameters = _buildGetParams(uri, mode);
            return RequestService.doGet(_url, _parameters);
        }

        function _buildGetParams(uri, mode) {
            var params = {};

            params.uri = _buildUriParam(uri).uri;
            params.mode = _buildModeParam(mode).mode;

            return params;

        }

        function _buildSaveParam(elementType, uri) {
            var params = {};

            if (typeof elementType !== 'undefined' && elementType != '') {
                params["type"] = elementType;
            }
            if (typeof uri !== 'undefined' && uri != '') {
                params["uri"] = uri;
            }

            return params;

        }
        function _buildSearchParam(dbName, mode) {
            var params = {};

            if (typeof dbName !== 'undefined' && dbName != '') {
                params["db-name"] = dbName;
            }

            params.mode = _buildModeParam(mode).mode;


            return params;

        }

        function _buildUriParam(uri) {
            var params = {};

            params.uri = '';
            if (typeof uri !== 'undefined' && uri != '') {
                params.uri = uri;
            }
            return params;

        }

        function _buildModeParam(mode) {
            var params = {};

            params.mode = '';
            if (typeof mode !== 'undefined' && mode != '') {
                params.mode = mode;
            }
            return params;

        }

        function _buildErrorResponseAlertText(response) {
            return RequestService.buildErrorResponseAlertText(response)
        }


        return InvoiceService;
    }
]);