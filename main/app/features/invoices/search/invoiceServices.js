'use strict';

itesoftMlEditor.factory('InvoiceService', ['$rootScope', 'globalConstants', 'RequestService',
    function ($rootScope, globalConstants, RequestService) {

        var InvoiceService = {
            search: _search,
            save: _save,
            get: _get,
            delete: _delete
        };

        function _search(searchParamObj) {
            var _url = RequestService.buildServiceUrl(globalConstants.SEARCH_INVOCE_PATH);
            var _parameters = _buildSearchParams(searchParamObj);
            return RequestService.doGet(_url, _parameters);
        }


        function _save(elementType, content, uri) {
            var _url = _buildServiceUrl(globalConstants.SAVE_INVOICE_PATH);
            var _parameters = _buildSaveParam(elementType, uri);
            return RequestService.doPost(_url, content, _parameters);
        }

        function _delete(itesoftid) {
            var _url = RequestService.buildServiceUrl(globalConstants.DELETE_INVOICE_PATH);
            var _parameters = _buildItesoftIdParam(itesoftid);
            return RequestService.doGet(_url, _parameters);
        }

        function _get(itesoftid, mode) {
            var _url = RequestService.buildServiceUrl(globalConstants.GET_INVOICE_PATH);
            var _parameters = _buildGetInvoiceParams(itesoftid, mode);
            return RequestService.doGet(_url, _parameters);
        }


        function _buildGetInvoiceParams(itesoftId, mode) {
            var params = {};

            params.itesoftid = _buildItesoftIdParam(itesoftId).itesoftid;
            params.mode = _buildModeParam(mode).mode;

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

            params.pageNum = globalConstants.SEARCH_INVOICE_RESULT_MAX_NUMBER;

            return params;


        }

        return InvoiceService;
    }
]);