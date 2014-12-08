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
            ko.applyBindings(new HomeViewModel());
        });
    }
};


export class HomeViewModel {
    constructor() {
        this.date = ko.observable();
        this.dates = ko.observableArray([]);
        this.scheduledDates = ko.observableArray([]);
        this.self = this;
        this.step = ko.observable(1);
        this.loading = ko.observable(false);
        this.url = ko.observable('');
        this.id = ko.observable('065c855c-b974-4604-939f-89036af26e9c');
        this.selectTimes = () => {
            this.scheduledDates.removeAll();
            var self = this;
            $.each(this.dates(), (i, o) => {
                self.scheduledDates.push(new ScheduledDateViewModel(o));
            });
        };
    }

    public date: KnockoutObservable<{}>;
    public dates: KnockoutObservableArray<{}>;
    public scheduledDates: KnockoutObservableArray<ScheduledDateViewModel>;
    public self;
    public selectTimes;
    public step;
    public loading: KnockoutObservable<boolean>;
    public url: KnockoutObservable<string>;
    public id: KnockoutObservable<string>;

    public next = () => {
        var step = this.step() + 1;
        this.step(step);
        if (step === 2) {
            this.selectTimes();
        }
        if (step === 3) {
            this.setBodyText();
        }
    };

    public prev = () => {
        var step = this.step() - 1;
        this.step(step);
    };

    public dateClicked = (date, e) => {
        console.log(date);
        if (this.dates().filter((val, i) => {
            return val == date;
        }).length == 0) {
            this.dates.push(date);
        }
    };

    public setBodyText = () => {
        var self = this;
        var data = { "Dates": ko.toJS(this.scheduledDates) };
        this.loading(true);
        $.ajax({
            url: '/api/Schedule/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done((res) => {
            console.log(res);
            self.loading(false);
            self.url('https://localhost/' + res);
            self.id(res);
            var message = Office.cast.item.toMessageCompose(Office.context.mailbox.item);


            message.body.setSelectedDataAsync("hello");
        });

        
    };


    public setSubject = () => {
        Office.cast.item.toItemCompose(Office.context.mailbox.item).subject.setAsync("Hello woasdasdsrld!");
    };

    public getSubject = () => {
        Office.cast.item.toItemCompose(Office.context.mailbox.item).subject.getAsync(function (result) {
            app.app.showNotification('The current subject is', result.value)
        });
    };

    public addToRecipients = () => {
        var item = Office.context.mailbox.item;
        var addressToAdd = new Office.EmailAddressDetails();
        addressToAdd.displayName = Office.context.mailbox.userProfile.displayName;
        addressToAdd.emailAddress = Office.context.mailbox.userProfile.emailAddress;
        

        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            Office.cast.item.toMessageCompose(item).to.addAsync([addressToAdd]);
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            Office.cast.item.toAppointmentCompose(item).requiredAttendees.addAsync([addressToAdd]);
        }
    };

};