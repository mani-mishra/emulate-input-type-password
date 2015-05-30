// Solution 0 - Smart Ass Solution 
// Convert type of the password input box from 'text' to 'password' ;)

var solution0 = function () {
    $('input[name="pass"]').prop('type', 'password');
};

// Solution 1:
// Use a hidden input param

var solution1 = function () {
    var passwordElement = $('input[name="pass"]');

    // create a hidden input field with name, to be sent to the server
    passwordElement.after('<input type="hidden" name="pass" id="hiddenPass">');

    // remove name property of the original input el, to stop sending it to server
    passwordElement.removeAttr('name');

    var password = '', // actual password in plaintext to be sent to server
        value = '', // value of the input box where user is typing
        mask = '', // mask string to show on the input box, instead of the typed character
        hiddenElement = $('#hiddenPass'), // hidden input element
        character = '', // the current chacracter entered by the user
        isInputHandlerActive = true; // flag to denote the event handler registered with input event

    var inputHandler = function (event) {

        // Get the current value of input box
        // e.g :  ****a
        value = $(this).val();

        // Get the character entered for this event
        // e.g.: a
        character = value.slice(-1);
        console.log('Character pressed =' + character);

        // Update the mask string and the input box
        mask = value.slice(0, -1) + "*";
        $(this).val(mask);

        // Update the password string, to be sent to the server, via uodating it in the hidden field
        password = password + character;
        console.log('Current Password is =' + password);
        hiddenElement.val(password);

    };

    // Register the input handler on input event
    // Not using keydown,keyup,keypress event as, when that event fires, browser
    // hasn't updated the input box yet, and there's no sure shot way of getting the 
    // value of character entered from the keyboard
    // String.fromCharCode(keyCode) is not reliable enough for all ASCII/unicode characters

    passwordElement.on('input', inputHandler);

    // the handler is to emulate the deletion of password on backspace and delete button
    passwordElement.on('keydown', function (event) {
        // this event will happen before input event
        // this is added to handle the special case of backspace/del
        // Emulate the deletion of password field
        // Delete is 8 and Backspace is 46
        var key = event.keyCode || event.charCode;
        if (key == 8 || key == 46) {

            // Disables the input handler
            // Allows the browser do its default event, i.e. delete the mask chacarcter from the text box
            passwordElement.off('input', inputHandler);
            isInputHandlerActive = false;

            // Delete the last charcter from the password string as well
            password = password.slice(0, -1);

            // Updates the hidden input value
            hiddenElement.val(password);

        } else if (!isInputHandlerActive) {
            // If any other key is present, re register the input handler, and update the flag
            passwordElement.on('input', inputHandler);
            isInputHandlerActive = true;
        }
    });
};

// Solution 2 
// Override form submit event