/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />
/* Common app functionality */


export module app {
    // Common initialization function (to be called from each page)
    export var initialize = function () {
        $('body').append(
            '<div id="notification-message">' +
            '<div class="padding">' +
            '<div id="notification-message-close"></div>' +
            '<div id="notification-message-header"></div>' +
            '<div id="notification-message-body"></div>' +
            '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });

        //$('#datepicker').datepicker({ inline: true });

    };
    // After initialization, expose a common notification function
    export var showNotification = function (header, text) {
        $('#notification-message-header').text(header);
        $('#notification-message-body').text(text);
        $('#notification-message').slideDown('fast');
    };

    export var getEmail = () => {
        if (typeof (Office.context.mailbox) === 'undefined') {
            return '';
        }
        return Office.context.mailbox.userProfile.emailAddress;
    };

    export var getName = () => {
        if (typeof (Office.context.mailbox) === 'undefined') {
            return '';
        }
        return Office.context.mailbox.userProfile.displayName;
    };
};