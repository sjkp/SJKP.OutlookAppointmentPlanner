///<amd-dependency path="knockout" />
///<reference path="../../Scripts/typings/knockout/knockout.d.ts" />
///<reference path="../../Scripts/typings/office/office.d.ts" />

import app = require('App/App');
import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
var Office = Microsoft.Office.WebExtension;

require(
    [
        'jquery',
        'knockout',
        'knockout-jqueryui/datepicker',
    ],
    ($, ko) => {
        'use strict';
        (<any>window).ko = ko;
        var home = new Home();
        home.initialize();
        if (typeof (Office) === 'undefined') {
            //Debug mode

        }
        else {
            Office.initialize = home.initialize;
        }
    }
    );

export class Home {

    constructor() {
    }


    // The initialize function must be run each time a new page is loaded
    public initialize(reason?) {
        $(document).ready(() => {
            app.app.initialize();
            //ko.applyBindings(new HomeViewModel());
            this.displayItemDetails();

        });
    }

    // Displays the "Subject" and "From" fields, based on the current mail item
    public displayItemDetails() {
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
    }
};