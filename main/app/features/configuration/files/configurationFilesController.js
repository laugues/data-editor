'use strict';

/* Controllers */

angular.module('MLEditor')
    .controller('ConfigurationFilesController', [
        '$scope',
        'globalConstants',
        'itPopup',
        'ConfigurationFilesService',
        '$translate',
        '$window',
        function ($scope, globalConstants, itPopup, ConfigurationFileService, $translate,$window) {

            $scope.lastItemIdentifier = null;
            $scope.currentXmlDOM = null;


            $scope.editorOptions = {
                lineWrapping: true,
                lineNumbers: true,
                indentWithTabs: true,
                matchTags: {bothTags: true},
                extraKeys: {
                    "Ctrl-J": "toMatchingTag",
                    "F11": function (cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                    },
                    "Esc": function (cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                    },
                    "Ctrl-Q": function (cm) {
                        cm.foldCode(cm.getCursor());
                    }
                },
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                styleActiveLine: true,
                mode: 'xml'
            };

            $scope.masterDetails = {};
            $scope.files = [
                {
                    "name": "indicators.xml",
                    "path": "/db/models/indicators.xml"
                },
                {
                    "name": "flow-indicators.xml",
                    "path": "/db/models/flow-indicators.xml"
                }
            ];
            $scope.masterDetails = {
                columnDefs: [
                    {
                        field: 'name',
                        displayName: 'CONFIGURATION.FILE.NAME',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    }, {
                        field: 'path',
                        displayName: 'CONFIGURATION.FILE.PATH',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    }]
            };

            $scope.masterDetails.disableMultiSelect = true;


            $scope.masterDetails.navAlert = {
                text: '{{\'CANNOT_EDIT_INVOCIE\' | translate}}',
                title: '{{\'WARNING\' | translate}}'
            };


            $scope.deleteIsDisabled = function () {
                var result = false;
                if ($scope.masterDetail.getSelectedItems().length == 0) {
                    result = true;
                }
                return result;
            };


            function _getItemIdentifier(item) {

                var result = null;

                if (item != null) {
                    result = item.path;
                }

                return result;
            }

            function _getOriginalItemIdentifier() {
                var originalItem = $scope.masterDetails.getCurrentItemWrapper().originalItem;
                return _getItemIdentifier(originalItem);
            }


            $scope.$watch('masterDetails.getCurrentItemWrapper().originalItem', function () {

                $scope.itemIdentifier = null;
                if ($scope.masterDetails.getCurrentItemWrapper() != null && typeof $scope.masterDetails.getCurrentItemWrapper() !== 'undefined') {

                    var originalItemIdentifier = _getOriginalItemIdentifier();

                    if (originalItemIdentifier != null) {
                        $scope.itemIdentifier = originalItemIdentifier;
                    }
                }
                if (typeof $scope.itemIdentifier !== "undefined" && $scope.itemIdentifier != null && $scope.itemIdentifier !== $scope.lastItemIdentifier) {
                    ConfigurationFileService.get($scope.itemIdentifier, 'xml').then(function (response) {

                        $scope.loadXmlInCurrentItem(response);

                        $scope.$applyAsync(function () {
                            $scope.masterDetails.setCurrentItem($scope.files[$scope.masterDetails.getCurrentItemWrapper().index]);
                        });
                        $scope.lastItemIdentifier = $scope.itemIdentifier;

                    }, function (response) {
                        $scope.data = response.data || "Request failed";
                        $scope.status = response.status;
                    });
                }
            });

            $scope.loadXmlInCurrentItem = function (response) {
                var lazyLoadedItem = {};
                angular.copy($scope.files[$scope.masterDetails.getCurrentItemWrapper().index], lazyLoadedItem);
                lazyLoadedItem.xml = vkbeautify.xml(response.data);
                angular.copy(lazyLoadedItem, $scope.files[$scope.masterDetails.getCurrentItemWrapper().index]);
            };


            $scope.getDetailMessage = function () {

                var message = '';
                if ($scope.masterDetails.initState) {
                    if ($scope.masterDetails.getSelectedItems().length > 0) {
                        message = $scope.masterDetails.getSelectedItems().length + ' items selected'
                    } else {
                        message = $translate.instant('NO_ITEM_SELECTED');
                    }
                }
                return message;
            }

            $scope.reloadFiles = function(){
                $scope.search();
            };

            $scope.search = function () {
                ConfigurationFileService.search('json').then(function (response) {
                    if (typeof  response.data.files !== 'undefined') {

                        $scope.files = response.data.files.file;

                        //Resize event for prevent uigrid sizing problems
                        $scope.$applyAsync(function () {
                            var event = document.createEvent('Event');
                            event.initEvent('resize', true /*bubbles*/, true /*cancelable*/);
                            $window.dispatchEvent(event);
                        });
                    }
                }, function (response) {
                    $scope.data = response.data || "Request failed";
                    $scope.status = response.status;

                    var text = _buildErrorResponseAlertText(response);
                    $scope.showAlertPopup("SAVE_FAILED", text);
                });
            };


            $scope.showAlertPopup = function (titleKey, message) {
                var alertPopup = itPopup.alert({
                    title: $translate.instant(titleKey),
                    text: message
                });
            };

            $scope.save = function () {

                var xmlChecked = _checkXml($scope.masterDetails.getCurrentItemWrapper().currentItem.xml);
                if (!xmlChecked) {
                    $scope.showAlertPopup('ERROR', '{{\'XML_NOT_VALID\' | translate}}');
                    return;
                }


                ConfigurationFileService.save(
                    'CONF',
                    $scope.masterDetails.getCurrentItemWrapper().currentItem.xml,
                    $scope.itemIdentifier).then(
                    function (response) {

                        angular.copy($scope.masterDetails.getCurrentItemWrapper().currentItem,
                            $scope.files[$scope.masterDetails.getCurrentItemWrapper().index]);

                        var saveResult = response.data;
                        $scope.showAlertPopup("SAVE_RESULT", saveResult);
                        $scope.$broadcast('unlockCurrentItem');

                    }, function (response) {
                        $scope.data = response.data || "Request failed";
                        $scope.status = response.status;

                        var text = _buildErrorResponseAlertText(response);
                        $scope.showAlertPopup("SAVE_FAILED", text);
                    });
            };


            $scope.undoChange = function () {

                $scope.masterDetails.undoChangeCurrentItem();
                $scope.disableSaveActions = false;
            };


            $scope.files = $scope.search();

            function _buildErrorResponseAlertText(response) {
                var text = '';
                var errorResponse = _getErrorResponse(response);
                if (typeof errorResponse !== 'undefined' && errorResponse != '' && errorResponse != null) {
                    $scope.errorStatusCode = {value: _getErrorResponseStatusCode(response)};
                    $scope.errorStatus = {value: _getErrorResponseStatus(response)};
                    $scope.errorMessageCode = {value: _getErrorResponseMessageCode(response)};
                    $scope.errorMessage = {value: _getErrorResponseMessage(response)};

                    text =
                        $translate.instant('ERROR_CODE', $scope.errorStatusCode) + " </br>" +
                        $translate.instant('ERROR_STATE', $scope.errorStatus) + " </br>" +
                        $translate.instant('ERROR_MESSAGE_CODE', $scope.errorMessageCode) + " </br>" +
                        $translate.instant('ERROR_MESSAGE', $scope.errorMessage) + " </br>";
                } else {
                    text = _getResponseData(response);
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

            function _loadJsonInItem(response) {
                var lazyLoadedItem = {};

                lazyLoadedItem = response.data;
                $scope.$applyAsync(function () {
                    console.log($scope.masterDetails.getCurrentItemWrapper().currentItem);
                    lazyLoadedItem.xml = $scope.masterDetails.getCurrentItemWrapper().currentItem.xml;
                    angular.copy(lazyLoadedItem, $scope.files[$scope.masterDetails.getCurrentItemWrapper().index]);
                });

            };



            function _checkXml(xml) {
                var oParser = new DOMParser();
                var oDOM = null;
                try {
                    oDOM = oParser.parseFromString(xml, "text/xml");
                    $scope.currentXmlDOM = oDOM;
                } catch (e) {
                    console.error("Xml is not valid : ", e.message);
                    return false;
                }
                return true;
            };

        }]);
