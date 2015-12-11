'use strict';

/* Controllers */

angular.module('MLEditor')
    .controller('ConfigurationFilesController', [
        '$rootScope',
        '$scope',
        'globalConstants',
        'itPopup',
        'CommonService',
        'XmlService',
        'ConfigurationFilesService',
        '$translate',
        function ($rootScope, $scope, globalConstants, itPopup, CommonService, XmlService, ConfigurationFileService, $translate) {

            $scope.lastItemIdentifier = null;
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
                text: '{{\'CANNOT_EDIT_INVOICE\' | translate}}',
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

            $scope.reloadFiles = function () {
                $scope.search();
            };

            $scope.search = function () {
                ConfigurationFileService.search('json').then(function (response) {
                    if (typeof  response.data.files !== 'undefined') {

                        $scope.files = response.data.files.file;

                        CommonService.resizeEvent();
                    }
                }, function (response) {
                    $scope.data = response.data || "Request failed";
                    $scope.status = response.status;

                    var text = ConfigurationFileService.buildErrorResponseAlertText(response);
                    CommonService.showErrorAlertPopup("SAVE_FAILED", text);
                });
            };

            $scope.save = function () {

                var xmlChecked = XmlService.validateXml($scope.masterDetails.getCurrentItemWrapper().currentItem.xml);
                if (!xmlChecked) {
                    CommonService.showErrorAlertPopup('ERROR', '{{\'XML_NOT_VALID\' | translate}}');
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
                        CommonService.showSuccessAlertPopup("SAVE_RESULT", saveResult);
                        $scope.$broadcast('unlockCurrentItem');

                    }, function (response) {
                        $scope.data = response.data || "Request failed";
                        $scope.status = response.status;

                        var text = ConfigurationFileService.buildErrorResponseAlertText(response);
                        CommonService.showErrorAlertPopup("SAVE_FAILED", text);
                    });
            };


            $scope.undoChange = function () {

                $scope.masterDetails.undoChangeCurrentItem();
                $scope.disableSaveActions = false;
            };


            $scope.files = $scope.search();

            function _loadJsonInItem(response) {
                var lazyLoadedItem = {};

                lazyLoadedItem = response.data;
                $scope.$applyAsync(function () {
                    console.log($scope.masterDetails.getCurrentItemWrapper().currentItem);
                    lazyLoadedItem.xml = $scope.masterDetails.getCurrentItemWrapper().currentItem.xml;
                    angular.copy(lazyLoadedItem, $scope.files[$scope.masterDetails.getCurrentItemWrapper().index]);
                });

            };

        }]);
