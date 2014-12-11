class CopyInputViewModel {
    constructor(data) {
        this.content = data.content;
        this.textSelected = ko.observable(false);
    }

    public content: KnockoutObservable<string>;
    public textSelected: KnockoutObservable<boolean>;

    public selectText = () => {
        this.textSelected(true);
    };
};

export = CopyInputViewModel;