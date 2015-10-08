'use strict';

/* Controllers */

angular.module('MLEditor')
    .controller('InvoiceSearchController', [
        '$scope',
        'globalConstants',
        'itPopup',
        'InvoiceService',
        '$translate',
        function ($scope, globalConstants, itPopup, InvoiceService, $translate) {

            $scope.lastItesoftId = null;
            $scope.invoiceXmlDOM = null;


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
            $scope.invoices = [];
            $scope.masterDetails = {
                columnDefs: [
                    {
                        field: 'ItesoftData.Document.Class.ITESOFTFields.ItesoftId',
                        displayName: 'ITESOFT_ID',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    }, {
                        field: 'ItesoftData.Document.Class.ITESOFTFields.BusinessGroup',
                        displayName: 'BUSINNESS_GROUP',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true,
                        enableGrouping: false
                    },
                    {
                        field: 'ItesoftData.Document.Class.HeaderFields.BATCHNAME',
                        displayName: 'BATCH_NAME',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: false
                    },
                    {
                        field: 'ItesoftData.Document.Class.HeaderFields.STATE',
                        displayName: 'STATE',
                        headerCellFilter: "translate",
                        enableSorting: true,
                        enableColumnMenu: true
                    },
                    {
                        field: 'ItesoftData.Document.Class.HeaderFields.SCANDATE',
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


            function _itesoftIdFromItem(item) {

                var result = null;
                if (
                    item != null &&
                    item.ItesoftData != null &&
                    item.ItesoftData.Document != null &&
                    item.ItesoftData.Document.Class != null &&
                    item.ItesoftData.Document.Class.ITESOFTFields != null &&
                    item.ItesoftData.Document.Class.ITESOFTFields.ItesoftId != null
                ) {
                    result = item.ItesoftData.Document.Class.ITESOFTFields.ItesoftId;
                }

                return result;
            }

            function _getOriginalItesoftId() {
                var originalItem = $scope.masterDetails.getCurrentItemWrapper().originalItem;
                return _itesoftIdFromItem(originalItem);
            }


            $scope.$watch('masterDetails.getCurrentItemWrapper().originalItem', function () {

                $scope.invoiceId = null;
                if ($scope.masterDetails.getCurrentItemWrapper() != null && typeof $scope.masterDetails.getCurrentItemWrapper() !== 'undefined') {

                    var originalItesoftId = _getOriginalItesoftId();

                    if (originalItesoftId != null) {
                        $scope.invoiceId = originalItesoftId;
                    }
                }

                if (typeof $scope.invoiceId !== "undefined" && $scope.invoiceId != null && $scope.invoiceId !== $scope.lastItesoftId) {

                    InvoiceService.get($scope.invoiceId, 'xml').then(function (response) {

                        $scope.loadXmlInCurrentItem(response);

                        $scope.$applyAsync(function () {
                            $scope.masterDetails.setCurrentItem($scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);
                        });
                        $scope.lastItesoftId = $scope.invoiceId;

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
                InvoiceService.search($scope.search).then(function (response) {

                    $scope.status = response.status;
                    if (typeof  response.data.invoice !== 'undefined') {
                        $scope.invoices = response.data.invoice;
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


            $scope.save = function () {

                var xmlChecked = _checkXml($scope.masterDetails.getCurrentItemWrapper().currentItem.xml);
                if (!xmlChecked) {
                    $scope.showAlertPopup('ERROR', '{{\'XML_NOT_VALID\' | translate}}');
                    return;
                }


                InvoiceService.save(
                    'INVOICE',
                    $scope.masterDetails.getCurrentItemWrapper().currentItem.xml,
                    '/db/invoices/2002/01/01/TEST/INV_20020101_TEST.xml').then(
                    function (response) {

                        angular.copy($scope.masterDetails.getCurrentItemWrapper().currentItem,
                            $scope.invoices[$scope.masterDetails.getCurrentItemWrapper().index]);

                        var saveResult = _buildResultResponseAlertText(response);
                        $scope.showAlertPopup("SAVE_RESULT", saveResult);

                        $scope.invoiceId = _getItesoftIdFromDOM();

                        InvoiceService.get($scope.invoiceId, 'json').then(function (response) {

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

                lazyLoadedItem = response.data;
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


            $scope.sendDeleteRequest = function (itesoftId, dataList, itemIndex) {
                InvoiceService.delete(itesoftId).then(function (response) {

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
                    $scope.sendDeleteRequest(_itesoftIdFromItem(entry), dataList, index);
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
