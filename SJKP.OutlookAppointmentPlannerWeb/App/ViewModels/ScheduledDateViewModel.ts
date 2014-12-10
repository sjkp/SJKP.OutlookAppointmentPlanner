///<reference path="ScheduledTimeslotViewModel.ts" />
import ScheduledTimeslotViewModel = require('App/ViewModels/ScheduledTimeslotViewModel');

class ScheduledDateViewModel {
    constructor(date, id?, timeslots?: ScheduledTimeslotViewModel[]) {        
        this.date = ko.observable(date);
        this.timeslots = ko.observableArray(timeslots || [new ScheduledTimeslotViewModel(), new ScheduledTimeslotViewModel(), new ScheduledTimeslotViewModel()]);
        this.numberOfTimeslots = ko.observable(3);
        this.id = ko.observable(id || '');
    }

    public id: KnockoutObservable<string>;
    public date: KnockoutObservable<{}>;
    public timeslots: KnockoutObservableArray<ScheduledTimeslotViewModel>;
    public numberOfTimeslots: KnockoutObservable<number>;    
};

export = ScheduledDateViewModel;