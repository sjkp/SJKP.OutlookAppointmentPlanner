///<reference path="ScheduledTimeslotViewModel.ts" />
import ScheduledTimeslotViewModel = require('App/ViewModels/ScheduledTimeslotViewModel');

class ScheduledDateViewModel {
    constructor(date : Date, id?, timeslots?: ScheduledTimeslotViewModel[]) {        
        this.date = ko.observable(date);
        this.timeslots = ko.observableArray(timeslots || [new ScheduledTimeslotViewModel()]);
        this.id = ko.observable(id || '');
    }

    public id: KnockoutObservable<string>;
    public date: KnockoutObservable<Date>;
    public timeslots: KnockoutObservableArray<ScheduledTimeslotViewModel>;  

    public addTimeslot = () => {
        this.timeslots.push(new ScheduledTimeslotViewModel());
    };

    public removeTimeslot = () => {
        this.timeslots.pop();
    }    
};

export = ScheduledDateViewModel;