'use strict';

/* Controllers */

angular.module('MLEditor')
    .controller('InvoiceQueuedController', [
        '$rootScope',
        '$scope',
        'globalConstants',
        'itPopup',
        'CommonService',
        'XmlService',
        'InvoiceQueuedService',
        '$translate',
        function ($rootScope, $scope, globalConstants, itPopup, CommonService, XmlService, InvoiceQueuedService, $translate) {

            $scope.lastItemIdentifier = null;
            $scope.masterDetails = {};
            $scope.invoices = [];

            $scope.masterDetails = {
                columnDefs: [
                    {
                        field: 'range',
                        displayName: 'UPDATE_RANGE',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    },
                    {
                        field: 'itesoftId',
                        displayName: 'ITESOFT_ID',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    }, {
                        field: 'businessGroup',
                        displayName: 'BUSINNESS_GROUP',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    },
                    {
                        field: 'batchName',
                        displayName: 'BATCH_NAME',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: false
                    },
                    {
                        field: 'scanDate',
                        displayName: 'SCAN_DATE',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true
                    }]
            };

            $scope.masterDetails.disableMultiSelect = true;


            $scope.masterDetails.navAlert = {
                text: '{{\'CANNOT_EDIT_INVOICE\' | translate}}',
                title: '{{\'WARNING\' | translate}}'
            };


            $scope.clearCriteria = function () {
                $scope.search.itesoftid = '';
                $scope.search.batchname = '';
                $scope.search.businessgroup = '';
                $scope.search.state = '';
                $scope.search.invoicenumber = '';
                $scope.search.category = '';
                $scope.search.startDate = '';
                $scope.search.endDate = '';
            };


            $scope.deleteIsDisabled = function () {
                var result = false;
                if ($scope.masterDetail.getSelectedItems().length == 0) {
                    result = true;
                }
                return result;
            };


            function _getItemIdentifierFromItem(item) {

                var result = null;
                if (item != null && item.uri != null) {
                    result = item.uri;
                }

                return result;
            }

            function _getOriginalItemIdentifier() {
                var originalItem = $scope.masterDetails.getCurrentItemWrapper().originalItem;
                return _getItemIdentifierFromItem(originalItem);
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

                    InvoiceQueuedService.get($scope.itemIdentifier, 'xml').then(function (response) {

                        $scope.loadXmlInCurrentItem(response);

                        $scope.$applyAsync(function () {
                            $scope.masterDetails.setCurrentItem($scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);
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
                angular.copy($scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index], lazyLoadedItem);
                lazyLoadedItem.xml = vkbeautify.xml(response.data);
                angular.copy(lazyLoadedItem, $scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);
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
            $scope.search = function () {
                $scope.invoices = [];
                InvoiceQueuedService.search($scope.search).then(function (response) {

                    $scope.status = response.status;
                    if (typeof  response.data.result.queuedInvoice !== 'undefined') {
                        $scope.invoices = response.data.result.queuedInvoice;

                        $scope.total = response.data.result.total;
                        $scope.pageStart = response.data.result.pageStart;
                        $scope.pageNum = response.data.result.pageNum;

                        CommonService.resizeEvent();
                    }
                }, function (response) {
                    $scope.data = response.data || "Request failed";
                    $scope.status = response.status;
                    var text = InvoiceQueuedService.buildErrorResponseAlertText(response);
                    CommonService.showErrorAlertPopup("SEARCH_FAILED", text);
                });
            };

            function _getItesoftIdFromDOM() {
                var result = null;

                if (typeof $rootScope.currentXmlDom !== 'undefined' && $rootScope.currentXmlDom != null) {
                    var itesoftidFromDOM = $rootScope.currentXmlDom.getElementsByTagName("ItesoftId");

                    if (itesoftidFromDOM != null && typeof itesoftidFromDOM !== 'undefined' && itesoftidFromDOM.length > 0) {

                        if (itesoftidFromDOM[0] != null && typeof itesoftidFromDOM[0].innerHTML !== 'undefined' && itesoftidFromDOM[0].innerHTML !== '') {
                            result = itesoftidFromDOM[0].innerHTML;
                        } else {
                            //for IE
                            var itesoftidFromDOMChildNode = itesoftidFromDOM[0].childNodes;
                            if (itesoftidFromDOMChildNode.length > 0 && itesoftidFromDOMChildNode[0] != null && typeof itesoftidFromDOMChildNode[0] !== 'undefined') {
                                result = itesoftidFromDOMChildNode[0].nodeValue;
                            } else {
                                console.error("Itesoft id from xml is null or empty");
                            }
                        }
                    } else {
                        console.error("Cannot find 'ItesoftId' element in invoice xml");
                    }
                } else {
                    console.error("$rootScope.currentXmlDom is undefined or null. So cannot retrieve 'ItesoftId' element in xml.");
                }
                return result;
            };

            $scope.showConfirmPopupDeleteItems = function (title, message) {
                var confirmPopup = itPopup.confirm({
                    title: title,
                    text: message,
                    buttons: [
                        {
                            text: '{{\'CONFIRM_BUTTON\' | translate}}',
                            type: 'btn-danger',
                            onTap: function () {
                                return true;
                            }
                        },
                        {
                            text: '{{\'CANCEL_BUTTON\' | translate}}',
                            type: 'btn-success',
                            onTap: function () {
                                return false;
                            }
                        }
                    ]
                });
                confirmPopup.then(function (res) {
                    _removeItems($scope.masterDetails.getSelectedItems(), $scope.invoices);
                    $scope.masterDetails.setCurrentItem(null);
                }, function () {

                });
            };


            function _getItesoftIdFromDOM() {
                var result = null;

                if (typeof $rootScope.currentXmlDom !== 'undefined' && $rootScope.currentXmlDom != null) {
                    var itesoftidFromDOM = $rootScope.currentXmlDom.getElementsByTagName("ItesoftId");

                    if (itesoftidFromDOM != null && typeof itesoftidFromDOM !== 'undefined' && itesoftidFromDOM.length > 0) {

                        if (itesoftidFromDOM[0] != null && typeof itesoftidFromDOM[0].innerHTML !== 'undefined' && itesoftidFromDOM[0].innerHTML !== '') {
                            result = itesoftidFromDOM[0].innerHTML;
                        } else {
                            //for IE
                            var itesoftidFromDOMChildNode = itesoftidFromDOM[0].childNodes;
                            if (itesoftidFromDOMChildNode.length > 0 && itesoftidFromDOMChildNode[0] != null && typeof itesoftidFromDOMChildNode[0] !== 'undefined') {
                                result = itesoftidFromDOMChildNode[0].nodeValue;
                            } else {
                                console.error("Itesoft id from xml is null or empty");
                            }
                        }
                    } else {
                        console.error("Cannot find 'ItesoftId' element in invoice xml");
                    }
                } else {
                    console.error("$rootScope.currentXmlDom is undefined or null. So cannot retrieve 'ItesoftId' element in xml.");
                }
                return result;
            };

            $scope.save = function () {

                var xmlChecked = XmlService.validateXml($scope.masterDetails.getCurrentItemWrapper().currentItem.xml);
                if (!xmlChecked) {
                    CommonService.showErrorAlertPopup('ERROR', '{{\'XML_NOT_VALID\' | translate}}');
                    return;
                }

                if (typeof $scope.itemIdentifier === 'undefined' || $scope.itemIdentifier == null) {
                    $scope.itemIdentifier = _getItesoftIdFromDOM();
                    console.log("$scope.itemIdentifier after set = ", $scope.itemIdentifier);
                }

                console.log("$scope.itemIdentifier = ", $scope.itemIdentifier);
                InvoiceQueuedService.save(
                    'QUEUE',
                    $scope.masterDetails.getCurrentItemWrapper().currentItem.xml,
                    $scope.itemIdentifier).then(
                    function (response) {

                        angular.copy($scope.masterDetails.getCurrentItemWrapper().currentItem,
                            $scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);

                        var saveResult = InvoiceQueuedService.buildErrorResponseAlertText(response);
                        CommonService.showSuccessAlertPopup("SAVE_RESULT", saveResult);

                        InvoiceQueuedService.getLight($scope.itemIdentifier, 'json').then(function (response) {

                            _loadJsonInItem(response);

                        }, function (response) {
                            $scope.data = response.data || "Request failed";
                            $scope.status = response.status;
                        });

                        $scope.$broadcast('unlockCurrentItem');

                    }, function (response) {
                        $scope.data = response.data || "Request failed";
                        $scope.status = response.status;

                        var text = InvoiceQueuedService.buildErrorResponseAlertText(response);

                        CommonService.showErrorAlertPopup("SAVE_FAILED", text);
                    });
            };

            function _loadJsonInItem(response) {
                var lazyLoadedItem = {};
                lazyLoadedItem = response.data.queuedInvoice;
                $scope.$applyAsync(function () {

                    lazyLoadedItem.xml = $scope.masterDetails.getCurrentItemWrapper().currentItem.xml;

                    angular.copy(lazyLoadedItem, $scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);
                });

            };

            $scope.undoChange = function () {

                var isRemoved = false;
                var wrapper = $scope.masterDetails.getCurrentItemWrapper();
                if (wrapper != null && typeof wrapper !== 'undefined') {

                    var originalItem = wrapper.originalItem;

                    //We are creating item
                    if (originalItem == null || typeof originalItem === 'undefined' || originalItem.xml == null || originalItem.xml == '') {

                        var currentItem = $scope.masterDetails.getCurrentItemWrapper().currentItem;

                        //The current xml in the editor is empty or null
                        if (currentItem != null && (currentItem.xml == null || currentItem.xml == '' )) {

                            // The list of invoices is not empty ==>
                            // Remove item from the grid of invoices
                            if ($scope.invoices.length > 0) {
                                _removeItemFromGrid($scope.invoices, $scope.invoices.length - 1);
                                var isRemoved = true;
                            }
                        }
                    }
                }
                $scope.masterDetails.undoChangeCurrentItem();

                if (isRemoved) {
                    $scope.masterDetails.setCurrentItem(null);
                }

                $scope.disableSaveActions = false;
            };

            $scope.addNewItem = function () {
                var newItem = {
                    "xml": null
                };

                $scope.invoices.push(newItem);
                $scope.masterDetails.setCurrentItem(newItem).then(function (success) {
                    $scope.$broadcast('lockCurrentItem', false);
                }, function (error) {

                });
            };

            $scope.deleteSelectedItems = function () {
                $scope.showConfirmPopupDeleteItems('{{\'DELETE_POPUP_TITLE\' | translate}}', '{{\'DELETE_POPUP_TEXT\' | translate}}');
            };


            $scope.sendDeleteRequest = function (itemIdentifier, dataList, itemIndex) {
                InvoiceQueuedService.delete(itemIdentifier).then(function (response) {

                    var deleteResult = InvoiceQueuedService.buildErrorResponseAlertText(response);
                    CommonService.showSuccessAlertPopup("DELETE_RESULT", deleteResult);
                    $scope.$broadcast('unlockCurrentItem');
                    _removeItemFromGrid(dataList, itemIndex);

                }, function (response) {

                    var text = InvoiceQueuedService.buildErrorResponseAlertText(response);
                    CommonService.showErrorAlertPopup("DELETE_FAILED", text);

                });
            };


            /**
             * Remove items froms the server and grid
             * @param items
             * @param dataList
             * @private
             */
            function _removeItems(items, dataList) {
                angular.forEach(items, function (entry) {
                    var index = dataList.indexOf(entry);
                    $scope.sendDeleteRequest(_getItemIdentifierFromItem(entry), dataList, index);
                })
            };

            /**
             * Remove an item from grid
             * @param dataList
             * @param index
             * @private
             */
            function _removeItemFromGrid(dataList, index) {
                dataList.splice(index, 1);
            };

        }]);