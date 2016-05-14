/// <reference path="byId.js" />
/// <reference path="bootstrap.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery.validate.min.js" />
/// <reference path="jquery.validate.unobtrusive.js" />
/*!
 * jQuery Server Validate 1.0 
 * (a plugin for ASP.NET MVC or any server side programming language)
 * Code : https://github.com/aukgit/jquery-server-validation
 * 
 * Copyright (c) 2015 by 
 * Md. Alim Ul Karim, Bangladesh, Dhaka.
 * me{at}alimkarim.com
 *
 * Performance test http://jsperf.com/jquery-specific-performance-test-with-non-specific
 * by Md. Alim Ul karim 
 * Date: 19 June 2015
 * Modified Date: 27 June 2015
 */

; (function ($, window, document, undefined) {

    "use strict";
    if (typeof jQuery === 'undefined') {
        throw new Error('serverValidate requires jQuery');
    }
    if (typeof jQuery.validator === "undefined") {
        throw new Error('serverValidate requires jQuery validation plugin & jquery.validate.unobtrusive plugin.');
    }
    var pluginName = "serverValidate",
        $divContainers,
        $selfContainer = null,
        defaults = {
            crossDomain: true,
            multipleRequests: true,
            checkValidationBeforeSendingRequest: true,
            dontSendSameRequestTwice: true,
            disableInputOnValidation: true,
            focusPersistIfNotValid: true,
            hideOnValidation: false,
            submitMethod: "post", // get or post
            eventsNameSpace: "jq.validate.",
            $directContainer: [],
            eventsObject: null, //this object will collect all the events
            url: "",
            messages: {
                requesting: "Requesting data..."
            },
            selectors: {
                divContainer: ".form-row",
                validatorContainer: ".validator-container",
                validator: ".validator",
                additionalFields: "[name=__RequestVerificationToken]"
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
                iconCreated: function ($div, $input, $iconContainer) { },
                sameRequestTwice: function ($div, $input, url, previousText) { },
                beforeSendingRequest: function ($div, $input, url) { },
                responseReceived: function ($div, $input, response) { },
                responseProcessed: function ($div, $input, response) { },
                invalidBefore: function ($div, $input, response) { },
                invalidAfter: function ($div, $input, response) { },
                validBefore: function ($div, $input, response) { },
                validAfter: function ($div, $input, response) { },
                onError: function ($div, $input, jqXHR, textStatus, exceptionMessage, url) { }
            }
        };



    // The actual plugin constructor
    var plugin = function ($divElement, $input, settings, additionalFields) {
        /// <summary>
        /// Process the div element and 
        /// </summary>
        /// <param name="$divElement">Processing div</param>
        /// <param name="settings">Settings for that div</param>
        /// <param name="additionalFields">Additional fields array of jquery element reference.</param>
        this.$element = $divElement;
        this._name = pluginName;
        this.$input = $input;
        this.settings = settings;
        this.additionalFields = additionalFields;

        this.events.plugin = this;
        this.events.names.plugin = this;

        this.init($divElement);
    }

    var processAdditionalFields = function ($elementContainer, additionalFields) {
        var addFields = [];
        var $elements = [];
        var isEmpty = $elementContainer === undefined || $elementContainer === null || $elementContainer.length === 0;
        if (!isEmpty) {
            $elements = $elementContainer.find(additionalFields);
        } else {
            $elements = $(additionalFields);
        }
        if ($elements.length > 0) {
            for (var i = 0; i < $elements.length; i++) {
                var $element = $($elements[i]);
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


    var getSingleSettingItem = function ($input, attribute, settingElement) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="$input">$input element settings</param>
        /// <param name="attribute"></param>
        /// <param name="settingElement"></param>
        /// <returns type=""></returns>
        var value = $input.attr(attribute);
        if (value !== undefined && value !== null) {
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            }
            return value;
        } else {
            return settingElement;
        }
    }

    var getSettingfromDiv = function ($input, settings) {
        /// <summary>
        /// Pass settings and it's got overwritten by $div attributes
        /// </summary>
        /// <param name="$input">$implement div with settings</param>
        /// <returns type="setting">returns settings</returns>
        var crossMatch = [
            { setting: "crossDomain", attr: "data-cross-domain" },
            { setting: "url", attr: "data-url" },
            { setting: "multipleRequests", attr: "data-is-multiple-requests" },
            { setting: "hideOnValidation", attr: "data-hide-on-success" },
            { setting: "disableInputOnValidation", attr: "data-disable-on-success" },
            { setting: "focusPersistIfNotValid", attr: "data-focus-on-fail" },
            { setting: "eventsObject", attr: "data-events-object" },
            { setting: "dontSendSameRequestTwice", attr: "data-dont-send-same-twice" },
            { setting: "focusPersistIfNotValid", attr: "data-focus-on-fail" },
            { setting: "submitMethod", attr: "data-submit-method" }
        ];
        for (var i = 0; i < crossMatch.length; i++) {
            var config = crossMatch[i];
            settings[config.setting] = getSingleSettingItem($input, config.attr, settings[config.setting]);
        }
        settings.selectors.additionalFields = getSingleSettingItem($input, "data-additional-selectors", settings.selectors.additionalFields);
        settings.messages.requesting = getSingleSettingItem($input, "data-requesting-label", settings.messages.requesting);
        return settings;
    }


    // Avoid Plugin.prototype conflicts
    $.extend(plugin.prototype, {
        isDebugging: false,
        additionalFields: [],
        $element: null,
        $input: null,
        isEmpty: function (variable) {
            return variable === null || variable === undefined || variable.length === 0;
        },
        init: function ($divElement) {

            if (this.isValidForProcessing($divElement)) {
                this.events.bindAllEvents(this);
                this.processDiv(this, $divElement);
            }
        },
        getSettings: function () {
            return this.settings;
        },
        isMultipleRequestAllowed: function () {
            return this.getSettings().multipleRequests;
        },
        isDisableInputOnValidation: function () {
            return this.getSettings().disableInputOnValidation;
        },
        isInputValidationRequirestoSendRequest: function () {
            return this.getSettings().checkValidationBeforeSendingRequest;
        },
        dontSendSameRequestTwice: function () {
            return this.getSettings().dontSendSameRequestTwice;
        },

        events: {
            names: {
                serverProcessStart: "serverProcessStart",
                serverProcessSucceeded: "serverProcessSucceeded",
                serverProcessFailed: "serverProcessFailed",
                serverProcessRunning: "serverProcessRunning",
                serverProcessReturnedAlways: "serverProcessReturnedAlways",
                hideIcons: "hideIcons",
                createIcon: "createIcon",
                showingSpinnerIcon: "showingSpinnerIcon",
                typingStart: "typingStart",
                getName: function (plugin, nameOfEvent) {
                    var settings = plugin.getSettings(),
                        nameSpace = settings.eventsNameSpace,
                        inputId = plugin.getInputNameOrId(plugin.$input),
                        finalName = nameSpace + inputId + "." + nameOfEvent;
                    //console.log(finalName);
                    return finalName;
                }
            },
            getEventsCommonAttributes: function (plugin, nameOfEvent, additionalAttributes) {
                /// <summary>
                /// Returns a json with a combination of additional json attributes.
                /// event = {
                ///     id: inputId,
                ///     name: $input.attr("name"),
                ///     $input: $input,
                ///     $divContainer: $div,
                ///     eventName: nameOfEvent,
                ///     finalEventName: finalEventName,
                ///     plugin: plugin,
                ///     settings: settings
                /// }
                /// </summary>
                /// <param name="nameOfEvent">Name of the event, eg. serverProcessStart</param>
                /// <param name="additionalAttributes">Json object</param>
                var $div = plugin.$element,
                    $input = plugin.$input,
                    settings = plugin.getSettings(),
                    inputId = plugin.getInputNameOrId(plugin.$input),
                    finalEventName = this.names.getName(plugin, nameOfEvent);

                var event = this[finalEventName];
                if (plugin.isEmpty(event)) {
                    //console.log("Event Created: " + finalEventName);
                    event = {
                        id: inputId,
                        name: $input.attr("name"),
                        $input: $input,
                        $divContainer: $div,
                        eventName: nameOfEvent,
                        finalEventName: finalEventName,
                        plugin: plugin,
                        settings: settings
                    };

                    event = $.extend({}, event, additionalAttributes);

                    this[finalEventName] = event;
                }

                return event;

            },

            bindAllEvents: function (plugin) {
                /// <summary>
                /// Bind all events
                /// </summary>


                var isInTestingMode = plugin.isDebugging,
                    evtNames = this.names,
                    //createIconEvtName = evtNames.getName(evtNames.createIcon),
                    //hideIconEvtName = evtNames.getName(evtNames.hideIcons),
                    serverStartEvtName = evtNames.getName(plugin, evtNames.serverProcessStart),
                    serverSuccessEvtName = evtNames.getName(plugin, evtNames.serverProcessSucceeded),
                    serverFailEvtName = evtNames.getName(plugin, evtNames.serverProcessFailed),
                    serverAlwaysEvtName = evtNames.getName(plugin, evtNames.serverProcessReturnedAlways);



                //bind events
                var $div = plugin.$element,
                    $input = plugin.$input,
                    url = plugin.getUrl(),
                    sendRequest = plugin.sendRequest,
                    cachedResponse;

                // server events

                // start

                var serverStartEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessStart, {
                    url: url
                });
                //serverStartEventData contains a json modifed only the url property.
                //  event = {
                //      id: inputId,
                //      name: $input.attr("name"),
                //      $input: $input,
                //      $divContainer: $div,
                //      eventName: nameOfEvent,
                //      finalEventName: finalEventName,
                //      plugin: plugin,
                //      settings: settings
                //  }
                $input.on(serverStartEvtName, serverStartEventData, function (evt) {
                    //console.log(evt.data.finalEventName);
                    var fields = plugin.concatAdditionalFields($input);
                    sendRequest(plugin, $div, $input, url, fields);
                });

                $div.on(serverStartEvtName, serverStartEventData, function (evt) {
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverStartEvtName);
                });


                // success
                var serverSuccessEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessSucceeded, {
                    url: url
                });
                $input.on(serverSuccessEvtName, serverSuccessEventData, function (evt, response) {
                    //console.log(evt.data.finalEventName);
                    cachedResponse = response;
                    if (isInTestingMode) {
                        console.log(response);
                    }
                    evt.data.response = response;
                    plugin.hideAllIcons($div); // hide all the icons
                    plugin.markAsProcessing($div, false);
                    plugin.processResponse($input, response);
                    $div.attr("data-icon-added", "true");
                    //icons show/hide
                    plugin.hideSpinner($input);
                });

                $div.on(serverSuccessEvtName, serverSuccessEventData, function (evt, response) {
                    evt.data.response = cachedResponse;
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverSuccessEvtName, [response]);
                });

                // failed
                var serverFailEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessFailed, {
                    url: url
                });
                $input.on(serverFailEvtName, serverFailEventData, function (evt, jqXHR, textStatus, exceptionMessage) {
                    //console.log(evt.data.finalEventName);
                    plugin.hideAllIcons($div); // hide all the icons
                    plugin.hideSpinner($input);
                    plugin.errorProcess($div, $input, jqXHR, textStatus, exceptionMessage, url);
                    //console.log("Request failed: " + exceptionMessage + ". Url : " + url);
                });

                $div.on(serverFailEvtName, serverFailEventData, function (evt, jqXHR, textStatus, exceptionMessage) {
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverFailEvtName, [jqXHR, textStatus, exceptionMessage]);
                });

                // always
                var serverAlwaysEventData = this.getEventsCommonAttributes(plugin, evtNames.serverProcessReturnedAlways, {
                    url: url
                });
                $input.on(serverAlwaysEvtName, serverAlwaysEventData, function (evt) {
                    evt.data.response = cachedResponse;
                    //console.log(evt.data.finalEventName);
                    //console.log(evt.data);
                });

                $div.on(serverAlwaysEvtName, serverAlwaysEventData, function (evt) {
                    //evt.data.response = cachedResponse;
                    //console.log("div: " + evt.data.finalEventName);
                    //$input.trigger(serverAlwaysEvtName);
                });

            }
        },

        getAttributes: function () {
            return this.getSettings().attributes;
        },
        getEvents: function () {
            return this.getSettings().events;
        },
        getIcons: function () {
            return this.getSettings().icons;
        },
        getIdPrefixes: function () {
            return this.getSettings().iconsIdPrefixes;
        },
        getSelectors: function () {
            return this.getSettings().selectors;
        },
        getMessages: function () {
            return this.getSettings().messages;
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
            if (this.isEmpty(this._url)) {
                var attrs = this.getAttributes(),
                    $input = this.getInput();

                this._url = $input.attr(attrs.url);
            }
            return this._url;
        },
        processDiv: function (plugin, $div) {
            //var $self = $selfContainer;
            var $input = this.getInput($div),
                url = this.getUrl();
            //this.test();
            this.inputProcessWithBlurEvent(plugin, $div, $input, url);

        },
        test: function () {
            this.showSpinner($input);
        },
        setCurrentTextForNexttimeChecking: function ($input) {
            $input.attr("data-previous-submit", $input.val());
        },
        isPreviousRequestIsSame: function ($div, $input, url) {
            /// <summary>
            /// Returns true/false based if it is the same request twice.
            /// Also called the event sameRequestTwice 
            /// </summary>
            /// <param name="$input"></param>
            /// <returns type="boolean">Returns true/false</returns>
            var previous = $input.attr("data-previous-submit"),
                returnStatement = previous === $input.val(),
                settings = this.getSettings(),
                events = settings.events;
            if (this.isDebugging) {
                console.log("Request is same : " + returnStatement);
            }

            if (returnStatement) {
                if (!this.isEmpty(events.sameRequestTwice)) {
                    events.sameRequestTwice($div, $input, url, previous);
                }
            }
            return returnStatement;
        },
        hideAllIcons: function ($div) {
            var self = this,
                $input = self.getInput();
            $div.removeAttr("data-icon-added");
            self.hideInvalidIcon($input);
            self.hideSpinner($input);
            self.hideErrorIcon($input);
            self.hideErrorIcon($input);
            self.hideValidIcon($input);
        },

        // processing
        inputProcessWithBlurEvent: function (self, $div, $input, url) {
            var //settings = this.getSettings(),
                isIconsVisible = true,
                eventsNames = self.events.names,
                serverProcessStartEvent = eventsNames.getName(self, eventsNames.serverProcessStart);

            var hideIcons = function () {
                if (isIconsVisible === true) {
                    self.hideAllIcons($div);
                    isIconsVisible = false;
                }
            }
            var blurEvent = function (event, url) {
                var isRequstValid = !self.isInProcessingMode($div) || self.isMultipleRequestAllowed();
                // if we are allowing to send multiple request while one is already being processing in the server.
                if (isRequstValid) {
                    var isDuplicateRequestAllowed = self.dontSendSameRequestTwice() && !self.isPreviousRequestIsSame($div, $input, url);
                    isRequstValid = isDuplicateRequestAllowed || !self.dontSendSameRequestTwice();
                    // check if same request is allowed to send twice.
                    if (isRequstValid) {

                        // if validation request before sending request.
                        var validationRequires = self.isInputValidationRequirestoSendRequest();

                        // is input needed to be valid before send the request.
                        isRequstValid = (validationRequires && $input.valid()) || !validationRequires;

                        if (isRequstValid) {
                            hideIcons();
                            isIconsVisible = true;
                            $input.trigger(serverProcessStartEvent);
                        }
                        if (self.getSettings().focusPersistIfNotValid) {
                            self.focusIfnotValid($input);
                        }
                    }
                }
            };


            var timeOutMethod;
            //$input.on("blur", function (evt) {

            //});
            $input.on("keypress", function (evt) {
                if (!self.isEmpty(timeOutMethod)) {
                    clearTimeout(timeOutMethod);
                }
                timeOutMethod = setTimeout(function () {
                    blurEvent(evt, url);
                }, 600);
            });
        },

        focusIfnotValid: function ($input, force) {
            /// <summary>
            /// Focus on the input if not valid.
            /// If forced then focus anyway.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="force"></param>
            /// <returns type=""></returns>
            if (force === true) {
                $input.focus();
                return;
            }
            if ($input.valid() === false) {
                $input.focus();
            }
        },
        concatAdditionalFields: function ($input) {
            var addFields = this.additionalFields.slice();
            var fields = {
                name: $input.attr("name"),
                value: $input.val()
            };
            addFields.push(fields);
            return addFields;
        },
        getSubmitMethod: function () {
            /// <summary>
            /// Returns submit method is it post or get
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>
            return this.getSettings().submitMethod;
        },
        abortPreviousAjaxRequest: function ($input) {
            /// <summary>
            /// Abort previous ajax request and hide all the icons
            /// </summary>
            /// <returns type=""></returns>
            if (!this.isEmpty(this.ajaxRequest)) {
                var $div = this.$element;
                this.ajaxRequest.abort();
                this.hideAllIcons($div);
                this.showSpinner($input);
                $div.attr("data-icon-added", "true");
            }
        },
        sendRequest: function (self, $div, $input, url, sendingFields) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="$div"></param>
            /// <param name="$input"></param>
            /// <param name="url"></param>
            /// <param name="sendingFields"></param>
            var method = self.getSubmitMethod($input),
                settings = self.getSettings(),
                isCrossDomain = settings.crossDomain,
                events = settings.events;
            if (!self.isEmpty(events.beforeSendingRequest)) {
                events.beforeSendingRequest($div, $input, url, sendingFields);
            }
            //icons show/hide
            // Abort previous ajax request and hide all the icons
            self.abortPreviousAjaxRequest($input);

            self.markAsProcessing($div, true);
            self.setCurrentTextForNexttimeChecking($input);
            self.hideAllIcons($div); // hide all the icons

            var evtNames = self.events.names,
                successEventName = evtNames.getName(self, evtNames.serverProcessSucceeded),
                failedEventName = evtNames.getName(self, evtNames.serverProcessFailed),
                alwaysEventName = evtNames.getName(self, evtNames.serverProcessReturnedAlways),
                ajaxProperties = {
                    method: method, // by default "GET"
                    url: url,
                    data: sendingFields, // PlainObject or String or Array
                    crossDomain: isCrossDomain,
                    dataType: "json" //, // "Text" , "HTML", "xml", "script" 
                };

            if (isCrossDomain == true) {
                ajaxProperties.dataType = "jsonp";
            }
            self.ajaxRequest = $.ajax(ajaxProperties).done(function (response) {
                $input.trigger(successEventName, [response]);
            }).fail(function (jqXHR, textStatus, exceptionMessage) {
                $input.trigger(failedEventName, [jqXHR, textStatus, exceptionMessage]);
            }).always(function () {
                $input.trigger(alwaysEventName);
            });

        },
        errorProcess: function ($div, $input, jqXHR, textStatus, exceptionMessage, url) {
            var code = jqXHR.status,
                settings = this.getSettings(),
                events = settings.events,
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
            if (settings.focusPersistIfNotValid) {
                this.focusIfnotValid($input, true);
            }
            if (!this.isEmpty(events.onError)) {
                events.onError($div, $input, jqXHR, textStatus, exceptionMessage, url);
            }

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
            var $span = $icon.find("a").attr("title", message)
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
                $div = this.$element,
                settings = this.getSettings(),
                events = settings.events,
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
            $.byId(finalId).tooltip();
            if (!this.isEmpty(events.iconCreated)) {
                events.iconCreated($div, $input, $created);
            }

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
            $spinner.hide();
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
            var self = this,
                $div = this.$element,
                settings = this.getSettings(),
                events = settings.events;

            if (!this.isEmpty(events.responseReceived)) {
                events.responseReceived($div, $input, response);
            }
            var responseFormat = settings.response;

            response = $.extend({}, responseFormat, response);
            if (response.isValid) {
                self.validResponse($input, response);
            } else {
                self.inValidResponse($input, response);
            }
            if (!this.isEmpty(events.responseProcessed)) {
                events.responseProcessed($div, $input, response);
            }
        },
        validResponse: function ($input, response) {
            /// <summary>
            /// Process if response has valid = true.
            /// </summary>
            /// <param name="$input"></param>
            /// <param name="response">Response json</param>
            // response is valid
            // spinner is already hidden from sendRequest method.
            //response: {
            //        message: "Field is valid.",
            //        isValid: true,
            //        isError: false,
            //        errorCode: null,
            //        errorMessage: null
            //}
            var isDisableInput = this.isDisableInputOnValidation(),
                events = this.getSettings().events,
                settings = this.getSettings(),
                $div = this.$element,
                validation = true,
                msg = response.message;
            if (!this.isEmpty(events.validBefore)) {
                events.validBefore($div, $input, response);
            }
            this.showValidIcon($input, response.message);

            if (isDisableInput) {
                $input.attr("disabled", "disabled");
            }

            $div.attr("data-server-validated", validation)
                .attr("data-message", msg);
            $input.attr("data-server-validated", validation)
                .attr("data-message", msg);

            if (settings.hideOnValidation) {
                $div.attr("data-is-hidden", validation);
                $div.hide('slow');
            }

            if (!this.isEmpty(events.validAfter)) {
                events.validAfter($div, $input, response);
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
            var settings = this.getSettings(),
                events = settings.events,
                $div = this.$element,
                validation = false,
                msg = response.message;

            if (!this.isEmpty(events.invalidBefore)) {
                events.invalidBefore($div, $input, response);
            }

            this.showInvalidIcon($input, response.errorMessage);
            $div.attr("data-server-validated", validation)
                .attr("data-message", msg);
            $input.attr("data-server-validated", validation)
                .attr("data-message", msg);
            if (settings.focusPersistIfNotValid) {
                this.focusIfnotValid($input, true);
            }
            if (!this.isEmpty(events.invalidAfter)) {
                events.invalidAfter($div, $input, response);
            }
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
        $selfContainer = this;
        var isEmptyContainer = $selfContainer === undefined || $selfContainer === null || $selfContainer.length === 0;
        var $elementContainer = this,
           settingsTemporary = $.extend({}, defaults, options),
           selectors = settingsTemporary.selectors,
           additionalFieldsSelectorArray = selectors.additionalFields;
        var additionalFields;
        if ($elementContainer.isValidationInit !== true) {
            if (settingsTemporary.$directContainer.length === 0) {
                $divContainers = $elementContainer.find(selectors.divContainer);
                $elementContainer.isValidationInit = true;
            }
        }

        var $containers = null;
        if (settingsTemporary.$directContainer.length === 0) {
            $containers = $divContainers;
        } else {
            //direct container element selected
            $containers = settingsTemporary.$directContainer;
        }
        var pluginAttacherElements = new Array($containers.length);
        for (var i = 0; i < $containers.length; i++) {
            var $divElement = $($containers[i]),
                settingTemporary2 = $.extend({}, defaults, options);
            if ($divElement.attr("data-is-validate") === "true") {
                var $input = $divElement.find("input");
                var settings = getSettingfromDiv($input, settingTemporary2);
                additionalFields = processAdditionalFields($elementContainer, additionalFieldsSelectorArray);
                var creatingPlugin = new plugin($divElement, $input, settings, additionalFields);
                pluginAttacherElements[i] = {
                    plugin: creatingPlugin,
                    additionalFields: additionalFields,
                    $divContainer: $divElement,
                    $input: $input,
                    options: settings
                };
            }
        }
        if (isEmptyContainer === false && $containers.length > 0) {
            $selfContainer["plugin." + pluginName] = {
                self: this,
                attachers: pluginAttacherElements
            }
        }
    };

})(jQuery, window, document);