/// <reference path="bootstrap-datetimepicker.js" />
/// <reference path="bootstrap.js" />
/// <reference path="byId.js" />
/// <reference path="every-page.js" />
/// <reference path="jquery-2.1.4-vsdoc.js" />
/// <reference path="jquery-2.1.4.js" />
/// <reference path="jquery.server-validate.js" />
/// <reference path="jquery.unobtrusive-ajax.min.js" />
/// <reference path="jquery.validate.min.js" />
/// <reference path="moment.js" />
/*!
 * Written by Alim Ul Karim
 * http://alimkarim.com
 * me{at}alimkarim.com
*/

$.genericPage = function() {
    function transactionStatusHide() {
        var $transactionStatus = $(".transaction-status");
        if ($transactionStatus.length > 0) {
            $transactionStatus.delay(1500).fadeOut(2500);
        }
    }
    var $tooltipItems = $('.tooltip-show');
    if ($tooltipItems.length > 0) {
        $tooltipItems.tooltip();
    }
    var $seoHideItems = $(".seo-hide");
    if ($seoHideItems.length > 0) {
        $seoHideItems.hide();
    }
    transactionStatusHide();

    $("div.datetimepicker-start").datetimepicker({
        pickDate: true, //en/disables the date picker
        pickTime: true, //en/disables the time picker
        useMinutes: true, //en/disables the minutes picker
        useSeconds: true, //en/disables the seconds picker
        useCurrent: true, //when true, picker will set the value to the current date/time     
        minuteStepping: 1, //set the minute stepping
        defaultDate: "", //sets a default date, accepts js dates, strings and moment objects
        disabledDates: [], //an array of dates that cannot be selected
        enabledDates: [], //an array of dates that can be selected
        sideBySide: true //show the date and time picker side by side

    });

    $("div.datepicker-start").datetimepicker({
        pickDate: true, //en/disables the date picker
        pickTime: false, //en/disables the time picker
        useMinutes: false, //en/disables the minutes picker
        useSeconds: false, //en/disables the seconds picker
        useCurrent: true, //when true, picker will set the value to the current date/time     
        minuteStepping: 1, //set the minute stepping
        defaultDate: "", //sets a default date, accepts js dates, strings and moment objects
        disabledDates: [], //an array of dates that cannot be selected
        enabledDates: [], //an array of dates that can be selected

        sideBySide: true //show the date and time picker side by side

    });

    // start processing here for this plugin.
    var $urlInput = $.byId("get-url");
    var $processForm = $.byId("process-form");

    var $inputs = $processForm.find("input");
    $inputs.attr('data-url', $urlInput.val());
    var $formRows = $processForm.find(".form-row");

    $formRows.attr("data-is-validate", "true");

    $processForm.serverValidate({
        crossDomain: true,
        multipleRequests: true,
        checkValidationBeforeSendingRequest: true,
        dontSendSameRequestTwice: true,
        disableInputOnValidation: true,
        focusPersistIfNotValid: true,
        hideOnValidation: false,
        messages: {
            requesting: "Requesting data Renamed..."
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
            iconCreated: function($div, $input, $iconContainer) {
                console.log("iconCreated");
                console.log($div);
                console.log($input);
                console.log($iconContainer);
            },
            sameRequestTwice: function($div, $input, url) {
                console.log("sameRequestTwice");
                console.log($div);
                console.log($input);
                console.log(url);
            },
            beforeSendingRequest: function($div, $input, url) {
                console.log("beforeSendingRequest");
                console.log($div);
                console.log($input);
                console.log(url);
            },
            responseReceived: function($div, $input, response) {
                console.log("responseReceived");
                console.log($div);
                console.log($input);
                console.log(response);
            },
            responseProcessed: function($div, $input, response) {
                console.log("responseProcessed");
                console.log($div);
                console.log($input);
                console.log(response);
            },
            invalidBefore: function($div, $input, response) {
                console.log("invalidBefore");
                console.log($div);
                console.log($input);
                console.log(response);
            },
            invalidAfter: function($div, $input, response) {
                console.log("invalidAfter");
                console.log($div);
                console.log($input);
                console.log(response);
            },
            validBefore: function($div, $input, response) {
                console.log("validBefore");
                console.log($div);
                console.log($input);
                console.log(response);
            },
            validAfter: function($div, $input, response) {
                console.log("validAfter");
                console.log($div);
                console.log($input);
                console.log(response);
            },
            onError: function($div, $input, jqXHR, textStatus, exceptionMessage, url) {
                console.log("onError");
                console.log($div);
                console.log($input);
                console.log(jqXHR);
                console.log(url);
            }
        }
    });



    $.byId("register-form").submit(function (e) {
        e.preventDefault();
        var $fromx = $(this);
  
        //$inputs.valid();
        //$.serverValidate();
    
    });

  
}


$(function () {

    $.genericPage();
});
