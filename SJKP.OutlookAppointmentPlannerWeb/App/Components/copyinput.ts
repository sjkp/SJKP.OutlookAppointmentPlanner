class CopyInputViewModel {
    constructor(data) {
        this.content = data.content;
        this.textSelected = ko.observable(false);
    }

    public content: KnockoutObservable<string>;
    public textSelected: KnockoutObservable<boolean>;

    public selectText = () => {
        this.textSelected(true);
        if (typeof (window.clipboardData) !== 'undefined') {
            window.clipboardData.setData("Text", this.content());
        }
    };
};

export = CopyInputViewModel;