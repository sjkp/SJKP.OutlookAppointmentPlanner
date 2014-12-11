///<amd-dependency path="knockout" />
///<reference path="../../Scripts/typings/knockout/knockout.d.ts" />
///<reference path="../../Scripts/typings/office/office.d.ts" />

import app = require('App/App');
import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import Utils = require('App/Utils');
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
        Office.initialize = home.initialize;
        //if (typeof (Office.context.mailbox) === 'undefined') {
        //    //Debug mode
            //home.initialize();
        //}
        //else {
            
        //}
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
        this.date = ko.observable(new Date());
        this.scheduledDates = ko.observableArray([]);
        this.self = this;
        this.step = ko.observable(1);
        this.loading = ko.observable(false);
        this.url = ko.observable('');
        this.id = ko.observable('');
        this.name = ko.observable(app.app.getName());
        this.email = ko.observable(app.app.getEmail());       
        this.description = ko.observable('');   
    }

    public date: KnockoutObservable<Date>;
    public scheduledDates: KnockoutObservableArray<ScheduledDateViewModel>;
    public self;
    public step;
    public loading: KnockoutObservable<boolean>;
    public url: KnockoutObservable<string>;
    public id: KnockoutObservable<string>;
    public name: KnockoutObservable<string>;
    public email: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    public next = () => {
        var step = this.step() + 1;
        this.step(step);
        if (step === 3) {
            this.createAppointment();
        }
    };

    public prev = () => {
        var step = this.step() - 1;
        this.step(step);
    };

    public reset = () => {
        this.scheduledDates.removeAll();
        this.description('');
        this.step(1);        
    };

    public dateClicked = (date, e) => {
        
        var self = this;
        if (this.scheduledDates().filter((val: ScheduledDateViewModel, i) => {
            return val.date().toDateString() == self.date().toDateString();
        }).length == 0) {
            this.scheduledDates.valueWillMutate();
            console.log(self.date());
            self.scheduledDates.push(new ScheduledDateViewModel(self.date()));
            this.scheduledDates().sort((a: ScheduledDateViewModel, b: ScheduledDateViewModel) => { return a.date().getTime() - b.date().getTime(); });
            this.scheduledDates.valueHasMutated();
        }
    };

    public addTimeslot = () => {
        $.each(this.scheduledDates(), (i, scheduledDate) => {
            scheduledDate.addTimeslot();
        });
    };
    public removeTimeslot = () => {
        $.each(this.scheduledDates(), (i, scheduledDate) => {
            scheduledDate.removeTimeslot();
        });
    };

    public timeslotText = (index) => {
        return "Timeslot " + (index() + 1);
    };

    public removeDate = (data) => {
        return this.scheduledDates.remove(data);
    };

    public nextText = () => {
        switch (this.step()) {
            case 1:
                return "Next (Select meeting time)";
                break;
            case 2: 
                return "Next (Create appointment)";
                break;
            case 3:
                return "Next (Provide feedback)";
            default:
                return "Next";
        }
    };

    public createAppointment = () => {
        var self = this;
        var data = {
            "Dates": ko.toJS(this.scheduledDates),
            "Description": self.description(),
            "CreatedBy": self.email()
        };
        this.loading(true);
        $.ajax({
            url: '/api/Schedule/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done((res) => {
                self.loading(false);
                self.url(Utils.Utils.getBaseUrl() + '/appointment?#?id=' + res);
                self.id(res);
            });
    };

    public setBodyText = () => {
        var self = this;
        Office.context.mailbox.item.body.getTypeAsync(function (type) {
            var bodyText = '<strong>' + app.app.getName() + '</strong> wants you to provide feedback about which time that suits you best for the appointment<br>' + self.description()+'<br>' + $('#signup').html();
            bodyText += '<br/><br/>Install the Schdo App for Outlook to provide your answer directly in Outlook, or visit <a href="' + self.url() + '">' + self.url() + '</a> to use our website';
            var bodyType = Office.CoercionType.Html;
            if ((!type.value || type.value.toLowerCase() === "text")) {
                bodyType = Office.CoercionType.Text;
                bodyText = 'none html';
            }
            var message = Office.cast.item.toMessageCompose(Office.context.mailbox.item);
            message.body.setSelectedDataAsync(bodyText, { coercionType: bodyType }, function (asyncResult) {
                if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                    //Do something.
                }
            });
        });       
    };


    public setSubject = (subject) => {
        Office.cast.item.toItemCompose(Office.context.mailbox.item).subject.setAsync(subject);
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