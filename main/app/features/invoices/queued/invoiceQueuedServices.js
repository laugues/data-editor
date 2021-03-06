'use strict';

angular.module('MLEditor')
    .factory('InvoiceQueuedService', [
        'globalConstants',
        'RequestService',
        function (globalConstants, RequestService) {

            var InvoiceQueuedService = {
                search: _search,
                save: _save,
                get: _get,
                getLight: _getLight,
                delete: _delete,
                buildErrorResponseAlertText : _buildErrorResponseAlertText
            }

            function _search(searchParamObj) {
                var _url = RequestService.buildServiceUrl(globalConstants.INVOICE_QUEUED.SEARCH.PATH);
                var _parameters = _buildSearchParams(searchParamObj);
                return RequestService.doGet(_url, _parameters);
            }


            function _save(elementType, content, uri) {
                var _url = RequestService.buildServiceUrl(globalConstants.INVOICE_QUEUED.SAVE.PATH);
                var _parameters = _buildSaveParam(elementType, uri);
                return RequestService.doPost(_url, content, _parameters);
            }

            function _delete(uri) {
                var _url = RequestService.buildServiceUrl(globalConstants.INVOICE_QUEUED.DELETE.PATH);
                var _parameters = _buildUriParam(uri);
                return RequestService.doGet(_url, _parameters);
            }

            function _get(uri, mode) {
                var _url = RequestService.buildServiceUrl(globalConstants.INVOICE_QUEUED.GET.PATH);
                var _parameters = _buildGetInvoiceParams(uri, mode);
                return RequestService.doGet(_url, _parameters);
            }

            function _getLight(uri, mode) {
                var _url = RequestService.buildServiceUrl(globalConstants.INVOICE_QUEUED.GET_LIGHT.PATH);
                var _parameters = _buildGetInvoiceParams(uri, mode);
                return RequestService.doGet(_url, _parameters);
            }


            function _buildGetInvoiceParams(uri, mode) {
                var params = {};

                params.uri = _buildUriParam(uri).uri;
                params.mode = _buildModeParam(mode).mode;

                return params;

            }

            function _buildUriParam(uri) {
                var params = {};

                params.itesoftid = '';
                if (typeof uri !== 'undefined' && uri != '') {
                    params.uri = uri;
                }
                return params;

            }

            function _buildItesoftIdParam(itesoftId) {
                var params = {};

                params.itesoftid = '';
                if (typeof itesoftId !== 'undefined' && itesoftId != '') {
                    params.itesoftid = itesoftId;
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

            function _buildSearchParams(searchParams) {
                var params = {};

                if (typeof searchParams.itesoftid !== 'undefined' && searchParams.itesoftid != '') {
                    params.itesoftid = searchParams.itesoftid;
                }

                if (typeof searchParams.batchname !== 'undefined' && searchParams.batchname != '') {
                    params.batchname = searchParams.batchname;
                }

                if (typeof searchParams.businessgroup !== 'undefined' && searchParams.businessgroup != '') {
                    params.businessgroup = searchParams.businessgroup;
                }

                if (typeof searchParams.state !== 'undefined' && searchParams.state != '') {
                    params.state = searchParams.state;
                }

                if (typeof searchParams.invoicenumber !== 'undefined' && searchParams.invoicenumber != '') {
                    params.invoicenumber = searchParams.invoicenumber;
                }

                if (typeof searchParams.category !== 'undefined' && searchParams.category != '') {
                    params.category = searchParams.category;
                }

                if (typeof searchParams.startDate !== 'undefined' && searchParams.startDate != '') {
                    params.startDate = searchParams.startDate;
                }

                if (typeof searchParams.endDate !== 'undefined' && searchParams.endDate != '') {
                    params.endDate = searchParams.endDate;
                }

                params.mode = searchParams.mode;
                params.pageNum = globalConstants.INVOICE_QUEUED.SEARCH.RESULT_MAX_NUMBER;

                return params;


            }

            function _buildErrorResponseAlertText(response) {
                return RequestService.buildErrorResponseAlertText(response)
            }

            return InvoiceQueuedService;
        }]);