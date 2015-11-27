'use strict';

/* Controllers */

angular.module('MLEditor')
    .controller('InvoiceQueuedController', [
        '$scope',
        'globalConstants',
        'itPopup',
        'InvoiceQueuedService',
        '$translate',
        '$window',
        function ($scope, globalConstants, itPopup, InvoiceQueuedService, $translate, $window) {

            $scope.lastItemIdentifier = null;
            $scope.invoiceXmlDOM = null;
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
                text: '{{\'CANNOT_EDIT_INVOCIE\' | translate}}',
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
                    $scope.showAlertPopup("SEARCH_FAILED", text);
                });
            };

            function _checkXml(xml) {
                var oParser = new DOMParser();
                var oDOM = null;
                try {
                    oDOM = oParser.parseFromString(xml, "text/xml");
                    $scope.invoiceXmlDOM = oDOM;
                } catch (e) {
                    console.error("Xml is not valid : ", e.message);
                    return false;
                }
                return true;
            };


            function _getItesoftIdFromDOM() {
                var result = null;

                if (typeof $scope.invoiceXmlDOM !== 'undefined' && $scope.invoiceXmlDOM != null) {
                    var itesoftidFromDOM = $scope.invoiceXmlDOM.getElementsByTagName("ItesoftId");

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
                    console.error("$scope.invoiceXmlDOM is undefined or null. So cannot retrieve 'ItesoftId' element in xml.");
                }
                return result;
            };

            $scope.showAlertPopup = function (titleKey, message) {
                var alertPopup = itPopup.alert({
                    title: $translate.instant(titleKey),
                    text: message
                });
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

                if (typeof $scope.invoiceXmlDOM !== 'undefined' && $scope.invoiceXmlDOM != null) {
                    var itesoftidFromDOM = $scope.invoiceXmlDOM.getElementsByTagName("ItesoftId");

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
                    console.error("$scope.invoiceXmlDOM is undefined or null. So cannot retrieve 'ItesoftId' element in xml.");
                }
                return result;
            };

            $scope.save = function () {

                var xmlChecked = _checkXml($scope.masterDetails.getCurrentItemWrapper().currentItem.xml);
                if (!xmlChecked) {
                    $scope.showAlertPopup('ERROR', '{{\'XML_NOT_VALID\' | translate}}');
                    return;
                }

                if(typeof $scope.itemIdentifier === 'undefined' || $scope.itemIdentifier == null){
                    $scope.itemIdentifier = _getItesoftIdFromDOM();
                    console.log("$scope.itemIdentifier after set = ",$scope.itemIdentifier);

                }

                console.log("$scope.itemIdentifier = ",$scope.itemIdentifier);
                InvoiceQueuedService.save(
                    'QUEUE',
                    $scope.masterDetails.getCurrentItemWrapper().currentItem.xml,
                    $scope.itemIdentifier).then(
                    function (response) {

                        angular.copy($scope.masterDetails.getCurrentItemWrapper().currentItem,
                            $scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);

                        var saveResult = _buildResultResponseAlertText(response);
                        $scope.showAlertPopup("SAVE_RESULT", saveResult);

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

                        var text = _buildErrorResponseAlertText(response);
                        $scope.showAlertPopup("SAVE_FAILED", text);
                    });
            };

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

                    var deleteResult = _buildResultResponseAlertText(response);
                    $scope.showAlertPopup("DELETE_RESULT", deleteResult);
                    $scope.$broadcast('unlockCurrentItem');
                    _removeItemFromGrid(dataList, itemIndex);

                }, function (response) {

                    var text = _buildErrorResponseAlertText(response);
                    $scope.showAlertPopup("DELETE_FAILED", text);

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
