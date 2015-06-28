# [jQuery Server Validation](https://github.com/aukgit/jquery-server-validation "jquery-server-validation")
A server side validation plugin for any programming language, specially for ASP.NET MVC with antiforgery validation
by [Alim Ul Karim](http://alimkarim.com "Alim Ul Karim")
![Example of jQuery server side validation.](https://raw.githubusercontent.com/aukgit/jquery-server-validation/master/jQueryValidationGif.gif)

#### [2 mins youtube video on how it works](https://www.youtube.com/watch?v=rzo9GcnUSik&feature=youtu.be "jQuery Server Validation how it works.")

#### CSS References

    <link href="content/css/animate-refresh.css" rel="stylesheet" />
    <link href="content/css/override-mvc.css" rel="stylesheet" />
    <link href="content/css/editor-templates.css" rel="stylesheet" />
    <link href="content/css/validator.css" rel="stylesheet" />

#### Html example

    
    <form action="index.html" class="form-horizontal register-form" enctype="multipart/form-data" id="register-form" method="post" role="form">
      <div id="process-form">
      	<input name="__RequestVerificationToken" type="hidden" value="tWwxNh3P0F0iIbngrjWV5eyjxPP5PsiC-_oB1rXTiPkEKJ--Z-v2AFy089a_LdvHzpS3We6GN_VeWBu2O4wkSXIrLQhyCaxoduBDTRbGZ_81" /><!--uxSlide by developers-organism and Alim Ul Karim hides everything except for first item=0, we can have more than one zeros-->    
      	<div class="form-group form-row" data-is-validate="true">
      		<div class="controls dev-plugin">
      			<label class="col-md-2 control-label" for="username>
      				User name
      				<span class="red">*</span>
      			</label>
      		<div class="col-md-10 form-input">
      			<div class="input-validator-container">
      				<input class="form-control" data-submit-method="post" data-val="true" data-val-length="The field User name must be a string with a maximum length of 30." data-val-length-max="30" data-val-minlength="The field User name must be a string or array type with a minimum length of &#39;3&#39;." data-val-minlength-min="3" data-val-regex="Username shouldn&#39;t contain any space or punctuation or any alphanumeric character." data-val-regex-pattern="^([A-Za-z]|[A-Za-z0-9_.]+)$" data-val-required="User name is a required field." id="UserName" name="UserName" placeholder="User name*" title="User name*" type="text" value=""
					data-url="**your server requestin url**" />
				      <div class="validator-container">
				      		<div class="validator"></div>
      				  </div>
      			</div>
     		 </div>
      		</div>
      	</div>    
       </div>
    </form>

#### Javascript References

    <script src="Content/Scripts/jquery-2.1.4.js"></script>
    <script src="Content/Scripts/bootstrap.js"></script>
    <script src="Content/Scripts/moment.js"></script>
    <script src="Content/Scripts/bootstrap-datetimepicker.js"></script>
    <script src="Content/Scripts/byId.js"></script>
    <script src="Content/Scripts/jquery.validate.js"></script>
    <script src="Content/Scripts/jquery.validate.unobtrusive.js"></script>
    <script src="Content/Scripts/jquery.server-validate.js"></script>
#### Javascript

    // pick the id container.
	var $processForm = $.byId("process-form");
	$processForm.serverValidate({
            crossDomain: true,
            multipleRequests: true,
            checkValidationBeforeSendingRequest: true,
            dontSendSameRequestTwice: true,
            disableInputOnValidation: true,
            focusPersistIfNotValid: true,
            hideOnValidation: false,
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
				// if user wanted to change the icon
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


