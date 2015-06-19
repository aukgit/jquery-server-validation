/// <reference path="byId.js" />
/// <reference path="bootstrap.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery.validate.min.js" />
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
    var pluginName = "serverValidate",
        defaults = {
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
                isValidate: "data-is-validate"
            },
            icons: {
                invalid: "fa fa-times",
                valid: "fa fa-check",
                loading: "fa fa-refresh"
            },
            response: {
                message: "Field is valid.",
                isValid: true,
                isError: false,
                errorCode: null,
                errorMessage: null
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
        var additionalFields = [];
        var selectors = this.settings.selectors.additionalFields;
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            var $element = $elementContainer.find(selector);
            if ($element.length > 0) {
                var nameOfElement = $element.attr('name');
                var valueOfElement = $element.attr('value');
                var pushingElement = {
                    name: nameOfElement,
                    value: valueOfElement
                };
                additionalFields.push(pushingElement);
            }
        }
        return additionalFields;
    }

    // Avoid Plugin.prototype conflicts
    $.extend(plugin.prototype, {
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
        isValidForProcessing: function ($div) {
            /// <summary>
            /// if it is valid for processing
            /// </summary>
            /// <param name="$div"></param>
            /// <returns type=""></returns>
            var attrs = this.settings.attributes;
            return $div.attr(attrs.isValidate) === 'true';
        },
        getInput: function ($div) {
            return $div.find("input");
        },
        getUrl: function ($input) {
            var attrs = this.settings.attributes;
            return $input.attr(attrs.url);
        },
        processDiv: function ($div) {
            var $input = this.getInput($div);
            var url = this.getUrl($input);
            
        },
        inputProcessWithBlurEvent: function($input, url) {
            
        },
        sendRequest: function ($input, url) {
            
        },
        validResponse: function() {
            
        },
        inValidResponse: function() {
            
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

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        var selectors = this.settings.selectors;
        var $divContainers = $elementContainer.find(selectors.divContainer);
        this.$divContainers = $divContainers;

        this.additionalFields = processAdditionalFields($elementContainer);

        for (var i = 0; i < $divContainers.length; i++) {
            var $divElement = $($divContainers[i]);
            plugin($divElement, options);
        }
    };

})(jQuery, window, document);