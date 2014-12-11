///<reference path="..\..\App\ViewModels\ScheduledDateViewModel.ts" />
import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import AttendeeViewModel = require('App/ViewModels/AttendeeViewModel');
import ScheduledTimeslotViewModel = require('App/ViewModels/ScheduledTimeslotViewModel');

class SignUpViewModel {
    constructor(data) {
        this.loading = ko.observable(true);
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.description = ko.observable('');

        this.scheduledDates = ko.observableArray([]);
        this.attendees = ko.observableArray([]);
        this.attendee = ko.observable(new AttendeeViewModel(this.username, this.email, data.id(), null));
        

        this.getData(data.id());
        data.id.subscribe((val) => {
            this.getData(val);
        });
        data.email.subscribe((val) => {
            this.getData(this.id());
        });
    }

    public id: KnockoutObservable<string>;
    public loading: KnockoutObservable<boolean>;
    public name: KnockoutObservable<string>;
    public scheduledDates: KnockoutObservableArray<ScheduledDateViewModel>;
    public attendees: KnockoutObservableArray<AttendeeViewModel>;
    public attendee: KnockoutObservable<AttendeeViewModel>;
    public description: KnockoutObservable<string>;
    public updateData: any;
    private username: KnockoutObservable<string>;
    private email: KnockoutObservable<string>;

    public getData = (id) => {
        var self = this;
        if (id.length === 0) {
            return;
        }
        $.when($.getJSON('/api/schedule/' + id, (data) => {
            //Load dates and timeslots from server
            self.scheduledDates([]);
            $.each(data.Dates, (i, o) => {
                self.scheduledDates.push(new ScheduledDateViewModel(o.Date, o.Id, o.Timeslots.map((timeslot) => {
                    return new ScheduledTimeslotViewModel(false, timeslot.Time, timeslot.Id);
                })));
            });
            self.description(data.Description || '');
            this.attendee(new AttendeeViewModel(this.username, this.email, id, null, JSON.parse(ko.toJSON(self.scheduledDates()))));
        }), $.getJSON('/api/schedule/' + id + '/attendees', (data) => {

            //Load attendees from server
            self.attendees([]);
            $.each(data, (i, attendee) => {
                var a = new AttendeeViewModel(attendee.Name, attendee.Email, attendee.ScheduleId, attendee.Id, attendee.SelectedDates.map((selectedDate) => {

                    return new ScheduledDateViewModel(selectedDate.Date, selectedDate.Id, selectedDate.Timeslots.map((timeslot) => {
                        return new ScheduledTimeslotViewModel(timeslot.Selected, timeslot.Time, timeslot.Id);
                    }));
                }));
                a.isEditable(attendee.Email == self.email());
                self.attendees.push(a);
            });
            })).then(() => {
                self.loading(false);
            });

    };       
    

    public save = () => {

        var self = this;
        $.ajax({
            url: '/api/attendee/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ko.toJS(this.attendee)),
            success: (res) => {
                console.log('done');
                self.attendee().isEditable(true);
                self.attendees.push(self.attendee());
                
                self.attendee(new AttendeeViewModel(self.name, self.email, self.id(),null, JSON.parse(ko.toJSON(self.scheduledDates()))));
            }
        });
    };    

}; 
export = SignUpViewModel;