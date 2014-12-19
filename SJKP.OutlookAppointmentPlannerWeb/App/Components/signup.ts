///<reference path="..\..\App\ViewModels\ScheduledDateViewModel.ts" />
import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import AttendeeViewModel = require('App/ViewModels/AttendeeViewModel');
import ScheduledTimeslotViewModel = require('App/ViewModels/ScheduledTimeslotViewModel');
import ScheduledAppointmentViewModel = require('App/ViewModels/ScheduledAppointmentViewModel');
import app = require('App/App');

class SignUpViewModel {
    constructor(data) {
        this.loading = data.loading || ko.observable(true);
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;

        this.scheduledAppointment = ko.observable(null);
        this.attendees = ko.observableArray([]);
        this.attendee = ko.observable(new AttendeeViewModel(this.username, this.email, data.id(), null));
        

        this.getData(data.id());
        data.id.subscribe((val) => {
            this.getData(val);
        });
        data.email.subscribe((val) => {
            this.getData(this.id());
        });

        this.canAddNewAttendee = ko.computed(() => {
            var self = this;
            var isNotAdded = this.attendees().filter((otherAttendee) => {
                return self.attendee().email() == otherAttendee.email;
            }).length == 0
            return isNotAdded || (typeof (self.scheduledAppointment) !== 'undefined' && self.scheduledAppointment() != null && self.scheduledAppointment().createdBy == self.email());
        }, this, { deferEvaluation: true });
    }

    public id: KnockoutObservable<string>;
    public loading: KnockoutObservable<boolean>;
    public name: KnockoutObservable<string>;
    public scheduledAppointment: KnockoutObservable<ScheduledAppointmentViewModel>;
    public attendees: KnockoutObservableArray<AttendeeViewModel>;
    public attendee: KnockoutObservable<AttendeeViewModel>;
    public updateData: any;
    public canAddNewAttendee: any;
    private username: KnockoutObservable<string>;
    private email: KnockoutObservable<string>;

    public getData = (id) => {
        var self = this;
        if (id.length === 0) {
            return;
        }
        $.when($.getJSON('/api/schedule/' + id, (data) => {
            //Load dates and timeslots from server
            this.scheduledAppointment(new ScheduledAppointmentViewModel(data));
            this.attendee(new AttendeeViewModel(this.username, this.email, id, null, JSON.parse(ko.toJSON(self.scheduledAppointment().dates()))));            
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
                
                self.attendee(new AttendeeViewModel(self.name, self.email, self.id(), null, JSON.parse(ko.toJSON(self.scheduledAppointment().dates()))));
                app.app.showNotification('Add done', 'Your feedback has been added');
            },
            error: (err) => {
                app.app.showNotification('Add failed', 'Unable to add your feedback, please try again');
            }
        });
    };    

}; 
export = SignUpViewModel;