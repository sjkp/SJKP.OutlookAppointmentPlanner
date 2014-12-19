class SpinnerViewModel {
    constructor(data) {
        this.loading = data.loading || ko.observable(true);
    }

    public loading: KnockoutObservable<boolean>;
};

export = SpinnerViewModel;