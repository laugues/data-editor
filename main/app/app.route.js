'use strict';

angular.module('MLEditor').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'app/features/login/loginView.html',
                controller: 'LoginController'
            }).
            when('/logout', {
                templateUrl: 'app/features/login/loginView.html',
                controller: 'LogoutController',
                redirectTo: '/login'
            }).
            when('/invoices/search', {
                templateUrl: 'app/features/invoices/search/invoice-search.html',
                controller: 'InvoiceSearchController',
                title:"PAGE.INVOICE_TITLE"
            }).
            when('/invoices/queued', {
                templateUrl: 'app/features/invoices/queued/invoice-queued.html',
                controller: 'InvoiceQueuedController',
                title:"PAGE.INVOICE_QUEUED_TITLE"
            }).when('/configuration/files', {
                templateUrl: 'app/features/configuration/files/configurarionFilesView.html',
                controller: 'ConfigurationFilesController',
                title:"PAGE.CONFIGURATION_FILE_TITLE"
            }).
            otherwise({
                redirectTo: '/login'
            });

    }]);