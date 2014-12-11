///<amd-dependency path="knockout" />
///<reference path="../../Scripts/typings/knockout/knockout.d.ts" />
///<reference path="../../Scripts/typings/office/office.d.ts" />
///<reference path="../../App/Utils.ts" />

import app = require('App/App');
import ScheduledDateViewModel = require('App/ViewModels/ScheduledDateViewModel');
import Utils = require('App/Utils');
var Office = Microsoft.Office.WebExtension;

require(
    [
        'jquery',
        'knockout',
        'knockout-jqueryui/datepicker',
    ],
    ($, ko) => {
        'use strict';
        (<any>window).ko = ko;
        var home = new Home();
        //home.initialize();
        Office.initialize = home.initialize;
        
    }
    );

export class Home {

    constructor() {
    }


    // The initialize function must be run each time a new page is loaded
    public initialize(reason?) {
        $(document).ready(() => {
            app.app.initialize();
            ko.applyBindings(new ReadViewModel());
        });
    }    
};

export class ReadViewModel {

    constructor() {
        var id = Utils.Utils.getParmFromHash(window.location.href, 'id');
        if (typeof (Office.context.mailbox) !== 'undefined') {
            var url = Office.context.mailbox.item.getRegExMatches().Url;
            console.log(url);
            if (url && url.length > 0) {
                id = Utils.Utils.getParmFromHash(url[0], 'id');
            }
        }
        this.id = ko.observable(id);
        this.name = ko.observable(app.app.getName());
        this.email = ko.observable(app.app.getEmail());   
        this.showNameDialog = ko.computed(() => {
            if (this.name().length > 0 && this.email().length > 0) {
                return false;
            }
            return true;
        }, this);       
    }

    public id: KnockoutObservable<string>;
    public email: KnockoutObservable<string>;
    public name: KnockoutObservable<string>;

    public showNameDialog: any;

    
};