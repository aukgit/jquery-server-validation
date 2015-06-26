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
        disableInputOnValidation: true,
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
            invalid: "validation-icon-invalid fa fa-times",
            valid: "validation-icon-valid fa fa-check",
            spinner: "validation-icon-spinner fa fa-refresh fa-spin-custom",
            error: "validation-icon-error fa fa-exclamation-circle"
        },
        iconsIdPrefixes: {
            invalid: "invalid-mark-",
            valid: "valid-mark-",
            spinner: "validation-spinner-",
            error: "validation-error-"
        },
        response: {
            message: "Field is valid.",
            isValid: true,
            isError: false,
            errorCode: null,
            errorMessage: null
        },
        events: {
            beforeSendingRequest: function ($div, $input, url) { },
            responseReceived: function ($div, $input, response) { },
            responseProcessed: function ($div, $input, response) { }
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
        isEmpty: function (variable) {
            return variable === null || variable === undefined || variable.length === 0;
        },
        init: function ($divElement) {
            if (this.isValidForProcessing($divElement)) {
                this.processDiv($divElement);
            }
        },
        isMultipleRequestAllowed: function () {
            return $selfContainer.settings.multipleRequests;
        },
        isDisableInputOnValidation: function () {
            return $selfContainer.settings.disableInputOnValidation;
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
        getIdPrefixes: function () {
            var $self = $selfContainer;
            return $self.settings.iconsIdPrefixes;
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
        getInput: function () {
            if (this.isEmpty(this.$input)) {
                var $div = this.$element;
                this.$input = $div.find("input");
            }
            return this.$input;
        },
        getUrl: function () {
            var attrs = this.getAttributes(),
                $input = this.getInput();
            return $input.attr(attrs.url);
        },
        processDiv: function ($div) {
            //var $self = $selfContainer;
            var $input = this.getInput($div);
            var url = this.getUrl();
            //this.test();
            this.inputProcessWithBlurEvent($div, $input, url);
        },
        test: function () {
            this.showSpinner($input);
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
                    var $inputNew = $input;///$(this);
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

            //icons show/hide
            this.showSpinner($input);
            this.hideInvalidIcon($input);
            this.hideValidIcon($input);

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
                self.processResponse($input, response);
                //icons show/hide
                self.hideSpinner($input);
            }).fail(function (jqXHR, textStatus, exceptionMessage) {
                self.errorProcess(jqXHR, textStatus, exceptionMessage, url);
                console.log("Request failed: " + exceptionMessage + ". Url : " + url);
            });
        },
        errorProcess: function (jqXHR, textStatus, exceptionMessage, url) {
            var $input = this.getInput(),
                code = jqXHR.status,
                msg = "";
            
            if (code === 0) {
                code = 404;
                textStatus = "Requested url doesn't lead to a valid request.";
            }
            msg = "Code " + code + " : " + textStatus;

            //console.log(jqXHR);
            //console.log(textStatus);
            //icons show/hide
            this.showErrorIcon($input, msg);
            this.hideInvalidIcon($input);
            this.hideValidIcon($input);
            this.hideSpinner($input);

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
        setMessageOnIcons: function ($icon, message) {
            var $span = $icon.attr("title", message)
                             .attr("data-original-title", message)
                             .find("span");
            $span.attr("title", message)
                .attr("data-display", message);
        },
        createIcons: function ($input, icon, toolTipmessage, idPrefix) {
            /// <summary>
            /// Create icon and return that Icon whole container.
            /// </summary>
            /// <param name="$input">Specific input, this.$input</param>
            /// <param name="icon">Icon class to display(mostly the font-awesome icons). Retrieve from this.getIcons()</param>
            /// <param name="toolTipmessage">Icon's tooltip message.</param>
            /// <param name="idPrefix">Id prefixes for that icon. For spinner this.getPrefixIds().spiner.</param>
            /// <returns type="">Returns created icon object.</returns>
            var id = this.getInputNameOrId($input),
                $validator = this.getValidator(),
                wrapperName = this.getWrapperPrefix(),
                finalId = idPrefix + id;

            var html = "<div class='validation-icon-wrapper' id='" + wrapperName + finalId + "'><a data-toggle='tooltip' id='" + finalId + "'" +
               "title='" + toolTipmessage + "' " +
               "data-original-title='" + toolTipmessage + "' " +
               "class='tooltip-show'>" +
                    "<span data-display='" + toolTipmessage + "' " +
                        "class='" + icon + "' " +
                        "title='" + toolTipmessage + "'></span>" +
                        "</a></div>";
            $validator.append(html);
            var $created = $.byId(wrapperName + finalId); // get the whole container
            $created.tooltip();
            return $created;
        },
        getWrapperPrefix: function () {
            return "wrapper-";
        },
        getValidator: function () {
            /// <summary>
            /// Returns validator div
            /// </summary>
            if (this.isEmpty(this.$validator)) {
                var selectors = this.getSelectors();
                this.$validator = this.$element.find(selectors.validator);
            }
            return this.$validator;
        },
        getCachedIcon: function ($input, iconIdPrefix) {
            /// <summary>
            /// Returns the icon for that specific icon id prefix
            /// If not exist then create one and then return.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="iconIdPrefix"></param>
            /// <returns type=""></returns>
            var ids = this.getIdPrefixes(),
                id = this.getWrapperPrefix() + // wrapper-
                    iconIdPrefix + // icon 
                    this.getInputNameOrId($input),
                cachedId = "$" + id;
            var $existingIcon = this[cachedId];
            if (this.isEmpty($existingIcon)) {
                // doesn't have the cache icon.
                // icon needs to be created.
                var messages = this.getMessages(),
                    msg = "", // no message except for spinner, others will come from server.
                    icons = this.getIcons(),
                    iconClass = "";
                // set icon classes based on the given id.
                if (iconIdPrefix === ids.spinner) {
                    iconClass = icons.spinner;
                    msg = messages.requesting;
                } else if (iconIdPrefix === ids.valid) {
                    iconClass = icons.valid;
                } else if (iconIdPrefix === ids.invalid) {
                    iconClass = icons.invalid;
                } else if (iconIdPrefix === ids.error) {
                    iconClass = icons.error;
                }
                $existingIcon = this.createIcons($input, iconClass, msg, iconIdPrefix);
                this[cachedId] = $existingIcon;
            }
            return $existingIcon;
        },
        //
        getInvalidIcon: function ($input) {
            /// <summary>
            /// Get invalid a tag.
            /// </summary>
            if (this.isEmpty(this.$invalidMarkIcon)) {
                var ids = this.getIdPrefixes();
                this.$invalidMarkIcon = this.getCachedIcon($input, ids.invalid);
            }
            return this.$invalidMarkIcon;
        },

        getValidIcon: function ($input) {
            /// <summary>
            /// Get valid a tag.
            /// </summary>
            if (this.isEmpty(this.$validMarkIcon)) {
                var ids = this.getIdPrefixes();
                this.$validMarkIcon = this.getCachedIcon($input, ids.valid);
            }
            return this.$validMarkIcon;
        },
        getSpinner: function ($input) {
            /// <summary>
            /// Get spinner's div tag.
            /// </summary>
            if (this.isEmpty(this.$spinner)) {
                var ids = this.getIdPrefixes();
                this.$spinner = this.getCachedIcon($input, ids.spinner);
            }
            return this.$spinner;
        },
        getErrorIcon: function ($input) {
            /// <summary>
            /// Get spinner's div tag.
            /// </summary>
            if (this.isEmpty(this.$errorIcon)) {
                var ids = this.getIdPrefixes();
                this.$errorIcon = this.getCachedIcon($input, ids.error);
            }
            return this.$errorIcon;
        },
        showIcon: function ($input, idPrefix, message) {
            var ids = this.getIdPrefixes(),
                $icon = this.getErrorIcon($input);
            this.setMessageOnIcons($icon, message);
            this.animateOn($icon);
        },
        showErrorIcon: function ($input, message) {
            var $icon = this.getErrorIcon($input);
            this.setMessageOnIcons($icon, message);
            this.animateOn($icon);
        },
        showSpinner: function ($input) {
            var $spinner = this.getSpinner($input);
            this.animateOn($spinner);
        },
        
        showInvalidIcon: function ($input, message) {
            var $markIcon = this.getInvalidIcon($input);
            this.setMessageOnIcons($markIcon, message);
            this.animateOn($markIcon);
        },
     
        showValidIcon: function ($input, message) {
            var $markIcon = this.getValidIcon($input);
            this.setMessageOnIcons($markIcon, message);
            this.animateOn($markIcon);
        },
        hideValidIcon: function ($input) {
            var $icon = this.getValidIcon($input);
            this.animateOff($icon);
        },
        hideErrorIcon: function ($input) {
            var $icon = this.getErrorIcon($input);
            this.animateOff($icon);
        },
        hideInvalidIcon: function ($input) {
            var $icon = this.getInvalidIcon($input);
            this.animateOff($icon);
        },
        hideSpinner: function ($input) {
            var $spinner = this.getSpinner($input);
            this.animateOff($spinner);
        },
        animateOn: function ($object) {
            $object.fadeIn("slow");
        },
        animateOff: function ($object) {
            $object.hide();
        },
        
        processResponse: function ($input, response) {
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
                self.validResponse($input, response);
            } else {
                self.inValidResponse($input, response);
            }
        },
        validResponse: function ($input, response) {
            /// <summary>
            /// Process if response has valid = true.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="response">Reponse json</param>
            // response is valid
            // spinner is already hidden from sendRequest method.
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            this.showValidIcon($input, response.message);
            var isDisableInput = this.isDisableInputOnValidation();
            if (isDisableInput) {
                $input.attr("disable", "disable");
            }
        },
        inValidResponse: function ($input, response) {
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            this.showInvalidIcon($input, response.errorCode + " : " + response.errorMessage);
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