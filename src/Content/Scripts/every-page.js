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
    var $formRows = $processForm.find(".form-row:first");

    $formRows.attr("data-is-validate", "true");

    $processForm.serverValidate();



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
