'use strict';

/* App Constant */

angular.module('MLEditor').constant('globalConstants',
    {
        //URL CONSTTANTS
        'DATA_SERVER_CONNECTION': 'http://CLILDS',
        'LOGIN_PATH': '/das-db/rest/db/storedXqueries/login.xqy',
        'GET_INVOICE_PATH': '/das-db/rest/db/storedXqueries/get-invoice.xqy',
        'SEARCH_INVOICE_PATH': '/das-db/rest/db/storedXqueries/search-invoice.xqy',
        'SAVE_INVOICE_PATH': '/das-db/rest/db/storedXqueries/importFile.xqy',
        'DELETE_INVOICE_PATH': '/das-db/rest/db/storedXqueries/delete-invoice.xqy',

        'SEARCH_INVOICE_RESULT_MAX_NUMBER': '50'
    }
)