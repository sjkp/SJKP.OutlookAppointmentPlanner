class ScheduledTimeslotViewModel {
    constructor(time?) {
        this.time = ko.observable(time || '');
    }
    public time: KnockoutObservable<{}>;
};

export = ScheduledTimeslotViewModel;