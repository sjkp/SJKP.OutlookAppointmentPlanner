import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import app = require('App/App');

class AttendeeViewModel {
    constructor(name: KnockoutObservable<string>, email: KnockoutObservable<string>, scheduleId : string, id? : string, selectedDates? : ScheduledDateViewModel[]) {
        this.selectedDates = ko.observableArray(selectedDates || []);
        this.name = name;
        this.email = email;
        this.scheduleId = ko.observable(scheduleId);
        this.id = ko.observable(id || '');   
        this.isEditable = ko.observable(false);
    }

    public selectedDates: KnockoutObservableArray<ScheduledDateViewModel>;
    public name: KnockoutObservable<string>;
    public email: any;
    public scheduleId: KnockoutObservable<string>;
    public id: KnockoutObservable<string>;
    public isEditable: KnockoutObservable<boolean>;

    public update = (data) => {
        var self = this;
                        
        $.ajax({
            url: '/api/attendee/' + self.id(),
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(ko.toJS(self)),
            success: (res) => {
                app.app.showNotification('Save done', 'Your feedback has been changed');
            },  
            error: (err) => {
                app.app.showNotification('Save failed', 'Unable to save your feedback, please try again');
            }                   
        });
    };
}
export = AttendeeViewModel;