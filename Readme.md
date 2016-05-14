# [jQuery Server Validation + ASP.NET Anti-forgery token](https://github.com/aukgit/jquery-server-validation "jquery-server-validation")
A server side validation plugin for any programming language, specially for ASP.NET MVC with antiforgery validation by [Alim Ul Karim](http://alimkarim.com "Alim Ul Karim")
![Example of jQuery server side validation.](https://raw.githubusercontent.com/aukgit/jquery-server-validation/master/jQueryValidationGif.gif)

#### [2 mins youtube video on how it works](https://www.youtube.com/watch?v=rzo9GcnUSik&feature=youtu.be "jQuery Server Validation how it works.")

## Why jQuery Server Validation? How does it help?
**Here are some bullet points :**

 1. Required **server side validation** with processing and check mark.
 2. Required **multiple validation** quickly setup.
 3. Validation options can be controlled from html attributes (use input and .form-row container attributes to override options for specific elements) . There is no good solution out [there](https://github.com/aukgit/jquery-server-validation/tree/e628bbc311f966330943643ab706cf17e5825772#html-attribute---meaning).
 4. **ASP.NET Anti-forgery token will be sent and validated with ajax request. ** If not present then will not be sent.

#### CSS References

    <link href="content/css/animate-refresh.css" rel="stylesheet" />
    <link href="content/css/override-mvc.css" rel="stylesheet" />
    <link href="content/css/editor-templates.css" rel="stylesheet" />
    <link href="content/css/validator.css" rel="stylesheet" />

#### **Html example**
##### **Single and Simple Example**
```html
<form id="process-form" action="/" class="form-horizontal" role="form">
    <div class="form-group form-row" data-is-validate="true">
        <label class="control-label" for="">User name *</label>
        <div class="input-validator-container">
            <!-- must use a name with input -->
            <input id="user-name" name="user-name" class="form-control" data-url="/validate" />
            <div class="validator-container">
                <div class="validator"></div>
            </div>
        </div>
    </div>
</form>
```
##### **Multiple Validation**
```html
<form id="process-form" action="/" class="form-horizontal" role="form">
    <div class="form-group form-row" data-is-validate="true">
        <label class="control-label" for="">User name *</label>
        <div class="input-validator-container">
            <!-- must use a name with input -->
            <input id="user-name" name="user-name" class="form-control" data-url="/validate/user" />
            <div class="validator-container">
                <div class="validator"></div>
            </div>
        </div>
    </div>
    <div class="form-group form-row" data-is-validate="true">
        <label class="control-label" for="">Email *</label>
        <div class="input-validator-container">
            <input id="email" name="email" class="form-control" data-url="/validate/email" />
            <div class="validator-container">
                <div class="validator"></div>
            </div>
        </div>
    </div>
</form>

```
##### **Multiple Customize validation with validation on/off feature**
```html
<form id="process-form" action="/" class="form-horizontal" role="form">
    <div class="form-group form-row" data-is-validate="false">
        <!-- this one will not validate since "data-is-validate" is false -->
        <label class="control-label" for="">User name *</label>
        <div class="input-validator-container">
            <!-- must use a name with input -->
            <input id="user-name" name="user-name" class="form-control" data-url="/validate/user" />
            <div class="validator-container">
                <div class="validator"></div>
            </div>
        </div>
    </div>
    <div class="form-group form-row" data-is-validate="true">
        <!-- this one will validate only -->
        <label class="control-label" for="">Email *</label>
        <div class="input-validator-container">
            <input id="email" name="email" class="form-control" data-url="/validate/email" />
            <div class="validator-container">
                <div class="validator"></div>
            </div>
        </div>
    </div>
</form>

```

##### **Server side validation with  client side validation (using jQuery and microsoft unobtrusive validation) + *ASP.NET Anti-forgery token* sent**
```html
    <form action="index.html" class="form-horizontal register-form" enctype="multipart/form-data" id="register-form" method="post" role="form">
      <div id="process-form">
      	<input name="__RequestVerificationToken" type="hidden" value="..." />
      	<div class="form-group form-row" data-is-validate="true">
      		<div class="controls dev-plugin">
      			<label class="col-md-2 control-label" for="username>
      				User name
      				<span class="red">*</span>
      			</label>
      		<div class="col-md-10 form-input">
      			<div class="input-validator-container">
      			    <!-- must use a name with input -->
      			    <!-- client side validation enabled with jquery validate -->
      				<input class="form-control" data-submit-method="post" data-val="true" data-val-length="The field User name must be a string with a maximum length of 30." data-val-length-max="30" data-val-minlength="The field User name must be a string or array type with a minimum length of &#39;3&#39;." data-val-minlength-min="3" data-val-regex="Username shouldn&#39;t contain any space or punctuation or any alphanumeric character." data-val-regex-pattern="^([A-Za-z]|[A-Za-z0-9_.]+)$" data-val-required="User name is a required field." id="UserName" name="UserName" placeholder="User name*" title="User name*" type="text" value=""
					data-url="**url**" />
				      <div class="validator-container">
				      		<div class="validator"></div>
      				  </div>
      			</div>
     		 </div>
      		</div>
      	</div>    
       </div>
    </form>
```
#### **Html Attribute - Meaning**
##### **Container Attribute ([class*='form-row'][data-is-validate='true/false'], **
```html
<div class="form-row" data-is-validate="true">
  <!-- class .form-row means container started -->        
  <!-- class .form-row name can be changed in the settings of component: find below -->
  <!-- data-is-validate enable disable server side validation -->
  ....
</div>
<div class="form-row" data-is-validate="false">
  <!-- disable validation since  data-is-validate is false-->
  ...
</div>
```
##### **Input Attribute : data-url **
It will override url option in the plugin for specific inputs. **Your input should always have** a **name** or **id**. Id is faster than name use it if possible.
```html
<div class="form-row" data-is-validate="true">
    <!-- enable server side validation since data-is-validate is true-->
    <div class="input-validator-container">
        <input id="email" name="email" data-url="/validate/email" />
        <div class="validator-container">
            <div class="validator"></div>
        </div>
    </div>
</div>
```
##### **Input Attribute : data-hide-on-success **
Hides the whole .form-row when the input is validated.
```html
<div class="form-row" data-is-validate="true">
    <!-- enable server side validation since data-is-validate is true-->
    <div class="input-validator-container">
        <input id="email" data-hide-on-success="true" name="email" data-url="/validate/email" />
        <div class="validator-container">
            <div class="validator"></div>
        </div>
    </div>
</div>
```
##### **Input Attribute : data-disable-on-success **
Hides the whole .form-row when the input is validated.
```html
<div class="form-row" data-is-validate="true">
    <!-- enable server side validation since data-is-validate is true-->
    <div class="input-validator-container">
        <input id="email" data-disable-on-success="true" name="email" data-url="/validate/email" />
        <div class="validator-container">
            <div class="validator"></div>
        </div>
    </div>
</div>
```
##### **Input Attribute : data-cross-domain **
Enables cross domain ajax request using jsonp and cors.
```html
<div class="form-row" data-is-validate="true">
    <!-- enable server side validation since data-is-validate is true-->
    <div class="input-validator-container">
        <input id="email" data-cross-domain="true" name="email" data-url="/validate/email" />
        <div class="validator-container">
            <div class="validator"></div>
        </div>
    </div>
</div>
```
#### Javascript References in html
```html
    <script src="Content/Scripts/jquery-2.1.4.js"></script>
    <script src="Content/Scripts/bootstrap.js"></script>
    <!-- don't add validations if client side validation is not required -->
    <script src="Content/Scripts/jquery.validate.js"></script>
    <script src="Content/Scripts/jquery.validate.unobtrusive.js"></script>
    <!-- only js for jquery server side validation  -->
    <script src="Content/Scripts/byId.js"></script>
    <script src="Content/Scripts/jquery.server-validate.js"></script>
```
#### Javascript
```javascript
    // pick the id container.
	var $processForm = $.byId("process-form"); // similar to $("#process-form") but faster
	$processForm.serverValidate({
            crossDomain: true, //request cross domain using jsonp
            checkValidationBeforeSendingRequest: true, // if enables client side validation using jquery validate and microosft jquery unobtrusive validation
            dontSendSameRequestTwice: true, // don't request the same previous text to the server, keep only 2 history of text inputs
            disableInputOnValidation: true, // disable the input when validation is successful.
            focusPersistIfNotValid: true, //if true then focus will persist until validated successfully.
            hideOnValidation: false, // hide the whole container when validation is successful.
            url: "", // server validation url, it could be same for all or it can be set by setting data-url attribute in the input. This will be overridden by the input attribute. **check out html attribute meanings.**
            submitMethod: "post", // get or post, ajax submit method for server side validation
            eventsNameSpace: "jq.validate.", // event name space
            $directContainer: [], // container can be given here then the plugin will not search for containers (".form-row") inside the root container. 
            messages: {
                requesting: "Requesting data..." // this message will be displayed when requesting for server side validation.
            },
            selectors: {
                divContainer: ".form-row", // container class can be changed
                validatorContainer: ".validator-container", // where the icons will be injected
                validator: ".validator",
                additionalFields: [
                    "[name=__RequestVerificationToken]" // additional fields to submit for server validation.
                ]
            },
            attributes: {
                url: "data-url", // input attribute for server validation url
                isValidate: "data-is-validate", // input attribute for  server validation enable/disable 
                submitMethod: "data-submit-method" // input attribute to send the server validation request as 'post' or 'get' can be changed
            },
            icons: {
				// if user wanted to change the icon
                invalid: "validation-icon-invalid fa fa-times", // classes to inject when data is invalid
                valid: "validation-icon-valid fa fa-check", // classes to inject when data is valid
                spinner: "validation-icon-spinner fa fa-refresh fa-spin-custom", // classes to inject when data is processing
                error: "validation-icon-error fa fa-exclamation-circle" // classes to inject when data has server side error or failed for 500 level error.
            },
            iconsIdPrefixes: {
                invalid: "invalid-mark-",
                valid: "valid-mark-",
                spinner: "validation-spinner-",
                error: "validation-error-"
            },
            response: { // a sample of response that the server should send.
                message: "Field is valid.", // Message 
                isValid: true, //is the sate valid or not.
                isError: false,
                errorCode: null,
                errorMessage: null // this message will be displayed if (isError) is true.
            },
            events: {
                iconCreated: function($div, $input, $iconContainer) {
                    console.log("iconCreated");
                    console.log($div); // get container
                    console.log($input); // get input object
                    console.log($iconContainer); //  get $icon-container
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

```
### Events name

 1. jq.validate.[name or id of the input].serverProcessStart  
```javascript
// ie. if input id is ".form-row">"exampleInput"
$("#exampleInput").on("jq.validate.exampleInput.serverProcessStart") {
	// server validation request sent to the server via validation url in the input
});
```
 2. jq.validate.[name or id of the input].serverProcessRunning
 3. jq.validate.[name or id of the input].serverProcessSucceeded
 4. jq.validate.[name or id of the input].serverProcessFailed
 5. jq.validate.[name or id of the input].serverProcessReturnedAlways

### Validation programmatically trigger and check
```javascript
     var $combo = $("select:first"); // getting a combo
     var $input = $(".form-row:first #exampleInput"); // $("#exampleInput") will be faster and work just fine. It is just to demonstrate where the input should be placed. The input should be placed in side the container ".form-row"
     $combo.on("change", function () {
	   $input.trigger("jq.validate.exampleInput.serverProcessStart"); // ask the plugin to communicate with the validate url given in the input or plugin and validate this $input.
       // to check final validity
       // we can listen to event called : "jq.validate.$inputIdOrName.serverProcessSucceeded"
       
       $input.on("jq.validate.exampleInput.serverProcessSucceeded", function (){
	       // input is validated.
       })on("jq.validate.exampleInput.serverProcessStart", function(){
	       // server validation process sent	       
       })on("jq.validate.exampleInput.serverProcessRunning", function(){
	       // while in the server process
	   })on("jq.validate.exampleInput.serverProcessFailed", function(){
	       // failed from server
	   })on("jq.validate.exampleInput.serverProcessReturnedAlways", function(){
	       // always will be stepped into this event.
       });
       // or it can also be checked with jquery validate 
	   if($input.valid()){ //jquery validate must be included.
		    // it is valid
	   }
     });
```