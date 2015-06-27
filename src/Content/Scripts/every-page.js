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
            requesting: "Requesting data XX..."
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
