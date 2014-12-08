import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');

class AttendeeViewModel {
    constructor(name, email, selectedDates? : ScheduledDateViewModel[]) {
        this.selectedDates = ko.observableArray(selectedDates || []);
        this.name = ko.observable(name || '');
        this.email = ko.observable(email || '');
    }

    public selectedDates: KnockoutObservableArray<ScheduledDateViewModel>;
    public name: KnockoutObservable<string>;
    public email: KnockoutObservable<string>;
}
export = AttendeeViewModel;