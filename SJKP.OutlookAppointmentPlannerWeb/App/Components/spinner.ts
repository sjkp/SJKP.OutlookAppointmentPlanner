class SpinnerViewModel {
    constructor(data) {
        this.loading = ko.isObservable(data.loading) ? data.loading : ko.observable(data.loading || true);
        this.loadingText = ko.isObservable(data.loadingText) ? data.loadingText : ko.observable(data.loadingText || '');
    }

    public loading: KnockoutObservable<boolean>;
    public loadingText: KnockoutObservable<boolean>;
};

export = SpinnerViewModel;