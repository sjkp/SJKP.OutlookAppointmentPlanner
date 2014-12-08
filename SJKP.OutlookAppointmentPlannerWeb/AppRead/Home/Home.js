///<amd-dependency path="knockout" />
///<reference path="../../Scripts/typings/knockout/knockout.d.ts" />
///<reference path="../../Scripts/typings/office/office.d.ts" />
define(["require", "exports", 'App/App', "knockout"], function(require, exports, app) {
    var Office = Microsoft.Office.WebExtension;

    require([
        'jquery',
        'knockout',
        'knockout-jqueryui/datepicker'
    ], function ($, ko) {
        'use strict';
        window.ko = ko;
        var home = new Home();
        home.initialize();
        if (typeof (Office) === 'undefined') {
            //Debug mode
        } else {
            Office.initialize = home.initialize;
        }
    });

    var Home = (function () {
        function Home() {
        }
        // The initialize function must be run each time a new page is loaded
        Home.prototype.initialize = function (reason) {
            var _this = this;
            $(document).ready(function () {
                app.app.initialize();

                //ko.applyBindings(new HomeViewModel());
                _this.displayItemDetails();
            });
        };

        // Displays the "Subject" and "From" fields, based on the current mail item
        Home.prototype.displayItemDetails = function () {
            var item = Office.cast.item.toItemRead(Office.context.mailbox.item);

            $('#subject').text(item.subject);
            var from;
            if (item.itemType === Office.MailboxEnums.ItemType.Message) {
                from = Office.cast.item.toMessageRead(item).from;
            } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
                from = Office.cast.item.toAppointmentRead(item).organizer;
            }

            if (from) {
                $('#from').text(from.displayName);
                $('#from').click(function () {
                    app.app.showNotification(from.displayName, from.emailAddress);
                });
            }
        };
        return Home;
    })();
    exports.Home = Home;
    ;
});
//# sourceMappingURL=Home.js.map
