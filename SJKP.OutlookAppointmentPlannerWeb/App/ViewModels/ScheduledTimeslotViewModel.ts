class ScheduledTimeslotViewModel {
    constructor(selected?, time?, id?) {
        this.time = ko.observable(time || '');
        this.id = ko.observable(id || '');
        this.selected = ko.observable(selected);
    }
    public time: KnockoutObservable<{}>;
    public id: KnockoutObservable<string>;
    public selected: KnockoutObservable<boolean>;
};

export = ScheduledTimeslotViewModel;