///<reference path="..\..\App\ViewModels\ScheduledDateViewModel.ts" />
import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import AttendeeViewModel = require('App/ViewModels/AttendeeViewModel');
import ScheduledTimeslotViewModel = require('App/ViewModels/ScheduledTimeslotViewModel');
class SignUpViewModel {
    constructor(data) {
        this.loading = ko.observable(true);
        

        this.scheduledDates = ko.observableArray([]);
        this.attendees = ko.observableArray([]);
        this.attendee = ko.observable(new AttendeeViewModel('test', 'test@test.dk'));
        this.id = ko.observable(data.id);
        
        
        
    }

    public id: KnockoutObservable<string>;
    public loading: KnockoutObservable<boolean>;
    public name: KnockoutObservable<string>;
    public scheduledDates: KnockoutObservableArray<ScheduledDateViewModel>;
    public attendees: KnockoutObservableArray<AttendeeViewModel>;
    public attendee: KnockoutObservable<AttendeeViewModel>;

    public getData = (id) => {
        var self = this;
        $.when($.getJSON('/api/schedule/' + id, (data) => {

            $.each(data.Dates, (i, o) => {
                self.scheduledDates.push(new ScheduledDateViewModel(o.Date, o.Timeslots.map((timeslot) => {
                    return new ScheduledTimeslotViewModel(timeslot.Time);
                })));
            });
        }), $.getJSON('/api/attendee/' + id, (data) => {
                self.attendees = ko.observableArray([]);
            })).then(() => {
                self.loading(false);
            });

    };

    updateData = ko.computed(() => {
        this.getData(this.id());
    }, this);

}; 
export = SignUpViewModel;