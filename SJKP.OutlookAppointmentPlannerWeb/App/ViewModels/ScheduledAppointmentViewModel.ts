import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import ScheduledTimeslotViewModel = require('App/ViewModels/ScheduledTimeslotViewModel');

class ScheduledAppointmentViewModel {
    constructor(data) {
        var self = this;
        this.dates = ko.observableArray([]);
        
        $.each(data.Dates, (i, o) => {
            self.dates.push(new ScheduledDateViewModel(o.Date, o.Id, o.Timeslots.map((timeslot) => {
                return new ScheduledTimeslotViewModel(false, timeslot.Time, timeslot.Id);
            })));
        });
        self.description = ko.observable(data.Description || '');
        self.createdBy = data.CreatedBy || '';
    }

    public description: KnockoutObservable<string>;
    public dates: KnockoutObservableArray<ScheduledDateViewModel>;
    public createdBy: string;
};

export = ScheduledAppointmentViewModel;