'use strict';

/* App Constant */

angular.module('MLEditor').constant('globalConstants',
    {
        //URL CONSTTANTS
        "DATA_SERVER_CONNECTION": "http://CLILDS",
        "DATA_DATABASE_NAME": "das-db",
        "LOGIN_PATH": "/das-db/rest/db/storedXqueries/login.xqy",
        "INVOICE": {
            "SEARCH": {
                "PATH": "/das-db/rest/db/storedXqueries/search-invoice.xqy?mode=json",
                "RESULT_MAX_NUMBER": "50"
            },
            "GET": {
                "PATH": "/das-db/rest/db/storedXqueries/get-invoice.xqy"
            },
            "SAVE": {
                "PATH": "/das-db/rest/db/storedXqueries/importFile.xqy"
            },
            "DELETE": {
                "PATH": "/das-db/rest/db/storedXqueries/delete-invoice.xqy"
            }

        },
        "INVOICE_QUEUED": {
            "SEARCH": {
                "PATH": "/das-db/rest/db/storedXqueries/queue/search-queued-invoice-light.xqy?mode=json",
                "RESULT_MAX_NUMBER": "50"
            },
            "GET": {
                "PATH": "/das-db/rest/db/storedXqueries/files/get-file.xqy"
            },
            "GET_LIGHT": {
                "PATH": "/das-db/rest/db/storedXqueries/queue/get-queued-invoice-light.xqy"
            },
            "SAVE": {
                "PATH": "/das-db/rest/db/storedXqueries/importFile.xqy"
            },
            "DELETE": {
                "PATH": "/das-db/rest/db/storedXqueries/queue/delete-queued-invoice.xqy"
            }

        },
        "CONFIGURATION_FILES": {
            "GET": {
                "PATH": "/das-db/rest/db/storedXqueries/files/get-file.xqy"
            },
            "SAVE": {
                "PATH": "/das-db/rest/db/storedXqueries/importFile.xqy"
            },
            "SEARCH": {
                "PATH": "/das-db/rest/db/storedXqueries/files/get-editable-files.xqy"
            }
        }
    }
)