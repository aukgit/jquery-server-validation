/// <reference path="byId.js" />
/// <reference path="bootstrap.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery.validate.min.js" />
/// <reference path="jquery.validate.unobtrusive.js" />
/*!
 * jQuery Server Validate 1.0 
 * (a plugin for ASP.NET MVC or server side programming language)
 * 
 * Copyright (c) 2015 by 
 * Md. Alim Ul Karim, Bangladesh, Dhaka.
 * me{at}alimkarim.com
 *
 * Performance test http://jsperf.com/jquery-specific-performance-test-with-non-specific
 * by Md. Alim Ul karim 
 * Date: 19 June 2015
 */

;



(function ($, window, document, undefined) {

    "use strict";
    if (typeof jQuery === 'undefined') {
        throw new Error('serverValidate requires jQuery');
    }
    if (typeof jQuery.validator === "undefined") {
        throw new Error('serverValidate requires jQuery validation plugin & jquery.validate.unobtrusive plugin.');
    }
    var pluginName = "serverValidate",
        $divContainers,
        settings,
        additionalFields,
        $selfContainer = null,
    defaults = {
        crossDomain: true,
        multipleRequests: true,
        checkValidationBeforeSendingRequest: true,
        dontSendSameRequestTwice: true,
        messages: {
            requesting: "Requesting data..."
        },
        selectors: {
            divContainer: ".form-row",
            validatorContainer: ".validator-container",
            validator: ".validator",
            additionalFields: [
                "[name=__RequestVerificationToken]"
            ]
        },
        attributes: {
            url: "data-url",
            isValidate: "data-is-validate",
            submitMethod: "data-submit-method"
        },
        icons: {
            invalid: "fa fa-times",
            valid: "fa fa-check",
            spinner: "fa fa-refresh fa-spin-custom"
        },
        response: {
            message: "Field is valid.",
            isValid: true,
            isError: false,
            errorCode: null,
            errorMessage: null
        },
        events: {
            beforeSendingRequest: null,
            responseReceived: null,
            responseProcessed: null
        }
    };

    // The actual plugin constructor
    function plugin($divElement) {
        /// <summary>
        /// Process the div element and 
        /// </summary>
        /// <param name="element"></param>
        /// <returns type=""></returns>
        this.$element = $divElement;
        this._name = pluginName;
        this.init($divElement);
    }

    function processAdditionalFields($elementContainer) {
        var addFields = [];
        var selectors = $elementContainer.settings.selectors.additionalFields;
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            var $element = $elementContainer.find(selector);
            if ($element.length > 0) {
                var nameOfElement = $element.attr("name");
                var valueOfElement = $element.attr("value");
                var pushingElement = {
                    name: nameOfElement,
                    value: valueOfElement
                };
                addFields.push(pushingElement);
            }
        }
        return addFields;
    }

    // Avoid Plugin.prototype conflicts
    $.extend(plugin.prototype, {
        isDebugging: true,
        isEmpty: function(variable) {
            return variable === null || variable === undefined || variable.length === 0;
        },
        init: function ($divElement) {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).
            if (this.isValidForProcessing($divElement)) {
                this.processDiv($divElement);
            }
        },
        isMultipleRequestAllowed: function () {
            return $selfContainer.settings.multipleRequests;
        },
        isInputValidationRequirestoSendRequest: function () {
            return $selfContainer.settings.checkValidationBeforeSendingRequest;
        },
        dontSendSameRequestTwice: function () {
            return $selfContainer.settings.dontSendSameRequestTwice;
        },
        getAttributes: function () {
            var $self = $selfContainer;
            return $self.settings.attributes;
        },
        getEvents: function () {
            var $self = $selfContainer;
            return $self.settings.events;
        },
        getIcons: function () {
            var $self = $selfContainer;
            return $self.settings.icons;
        },
        getSelectors: function () {
            var $self = $selfContainer;
            return $self.settings.selectors;
        },
        getMessages: function () {
            var $self = $selfContainer;
            return $self.settings.messages;
        },
        isValidForProcessing: function ($div) {
            /// <summary>
            /// if it is valid for processing
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>

            var attrs = this.getAttributes();
            return $div.attr(attrs.isValidate) === "true";
        },
        getInput: function ($div) {
            return $div.find("input");
        },
        getUrl: function ($input) {
            var $self = $selfContainer;

            var attrs = $self.settings.attributes;
            return $input.attr(attrs.url);
        },
        processDiv: function ($div) {
            //var $self = $selfContainer;
            var $input = this.getInput($div);
            var url = this.getUrl($input);
            this.inputProcessWithBlurEvent($div, $input, url);
        },
        setCurrentTextForNexttimeChecking: function ($input) {
            $input.attr("data-previous-submit", $input.val());
        },
        isPreviousRequestIsSame: function ($input) {
            var previous = $input.attr("data-previous-submit");
            var returnStatement = previous === $input.val();
            if (this.isDebugging) {
                console.log("Request is same : " + returnStatement);
            }
            return returnStatement;
        },
        inputProcessWithBlurEvent: function ($div, $input, url) {
            var self = this;
            $input.on("blur", function () {
                var isRequstValid = !self.isInProcessingMode($div) || self.isMultipleRequestAllowed();
                // if we are allowing to send multiple request while one is already being processing in the server.
                if (isRequstValid) {
                    var $inputNew = $(this);
                    var isDuplicateRequestAllowed = self.dontSendSameRequestTwice();
                    isRequstValid = (isDuplicateRequestAllowed && !self.isPreviousRequestIsSame($inputNew)) || !isDuplicateRequestAllowed;
                    // check if same request is allowed to send twice.
                    if (isRequstValid) {

                        // if validation request before sending request.
                        var validationRequires = self.isInputValidationRequirestoSendRequest();

                        // is input needed to be valid before send the request.
                        isRequstValid = (validationRequires && $inputNew.valid()) || !validationRequires;

                        if (isRequstValid) {
                            var fields = self.concatAdditionalFields($inputNew);
                            self.sendRequest($div, $inputNew, url, fields);
                        }
                    }
                }
            });
        },
        concatAdditionalFields: function ($input) {
            var addFields = $selfContainer.additionalFields.slice();
            var fields = {
                name: $input.attr("name"),
                value: $input.val()
            };
            addFields.push(fields);
            return addFields;
        },
        getSubmitMethod: function ($input) {
            /// <summary>
            /// Returns submit method is it post or get
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>
            var attrs = $selfContainer.settings.attributes;
            return $input.attr(attrs.submitMethod);
        },
        sendRequest: function ($div, $input, url, sendingFields) {

            var method = this.getSubmitMethod($input);
            var self = this;
            var isInTestingMode = self.isDebugging;
            this.showSpinner($input);
            self.markAsProcessing($div, true);
            self.setCurrentTextForNexttimeChecking($input);
            jQuery.ajax({
                method: method, // by default "GET"
                url: url,
                data: sendingFields, // PlainObject or String or Array
                crossDomain: true,
                dataType: "JSON" //, // "Text" , "HTML", "xml", "script" 
            }).done(function (response) {
                if (isInTestingMode) {
                    console.log(response);
                }
                self.markAsProcessing($div, false);
                self.processResponse(response);
                self.hideSpinner($input);

            }).fail(function (jqXHR, textStatus, exceptionMessage) {
                console.log("Request failed: " + exceptionMessage + ". Url : " + url);
            });
        },
        markAsProcessing: function ($div, isProcessing) {
            if (this.isDebugging) {

                console.log("Making: " + isProcessing);
            }
            $div.attr("data-is-processing", isProcessing);
        },
        isInProcessingMode: function ($div) {
            var attr = $div.attr("data-is-processing");
            if (this.isDebugging) {
                console.log("is Processing: " + attr);
            }
            return attr === "true";
        },
        getInputNameOrId: function ($input) {
            var id = $input.attr('id');
            if (this.isEmpty(id)) {
                id = $input.attr('name');
            }
            return id;
        },
        createSpinner: function ($div, $input) {
            var messages = this.getMessages(),
                requesting = messages.requesting,
                icons = this.getIcons(),
                spinnerIcon = icons.spinner,
                id = this.getInputNameOrId($input),
                $validator = this.getValidator(),
                finalId = "spinner-" + id ;

            var html = "<a data-toggle='tooltip' id='" + finalId+ "'" +
               "title='" + requesting + "' " +
               "data-original-title='" + requesting + "' " +
               "class='tooltip-show validation-spinner'>" +
                    "<span data-display='" + requesting + "' " +
                        "class='" + spinnerIcon + "' " +
                        "title='" + requesting + "'></span>" +
                        "</a>";
            $validator.append(html);
            var $spinner = $.byId(finalId);
            $spinner.tooltip();

            return $spinner;
        },
        getValidator: function() {
            /// <summary>
            /// Returns validator div
            /// </summary>
            if (this.isEmpty(this.$validator)) {
                var selectors = this.getSelectors();
                this.$validator = this.$element.find(selectors.validator);
            }
            return this.$validator;
        },
        getSpinner: function() {
            /// <summary>
            /// Get spinner a tag.
            /// </summary>
            if (this.isEmpty(this.$spinner)) {
                var $validator = this.getValidator();
                this.$spinner = $validator.find(".validation-spinner");
            }
            return this.$spinner;
        },
        showSpinner: function ($input) {
            var $div = this.$element,
                $spinner = this.getSpinner();
            if ($spinner.length === 0) {
                $spinner = this.createSpinner($div, $input);
            }
            $spinner.show("slow");
        },
        hideSpinner: function ($input) {
            var $spinner = this.getSpinner();
            $spinner.hide("slow");
        },
        processResponse: function (response) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="response"></param>
            /// <returns type=""></returns>
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            var $self = $selfContainer;
            var self = this;

            var responseFormat = $self.settings.response;
            response = $.extend({}, responseFormat, response);
            if (response.isValid) {
                self.validResponse(response);
            } else {
                self.inValidResponse(response);
            }
        },
        validResponse: function (response) {

        },
        inValidResponse: function (response) {

        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.serverValidate = function (options) {
        /// <summary>
        /// expecting a container which contains divs
        /// of .form-row and inside there is a input with
        /// a .validator-container>.validator
        /// </summary>
        /// <param name="options"></param>
        /// <returns type=""></returns>
        var $elementContainer = this;
        $selfContainer = this;
        if ($elementContainer.isInit !== true) {
            this.settings = $.extend({}, defaults, options);
            var selectors = this.settings.selectors;
            this.$divContainers = $elementContainer.find(selectors.divContainer);
            this.additionalFields = processAdditionalFields($elementContainer);
            this.isInit = true;
        }
        for (var i = 0; i < this.$divContainers.length; i++) {
            var $divElement = $(this.$divContainers[i]);
            new plugin($divElement, options);
        }
    };

})(jQuery, window, document);