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
        var home = new Read();
        Office.initialize = home.initialize;
        setTimeout(() => {
            try {
                if (!(<any>(window.external)).GetContext) {
                    (<any>window).Office.initialize();
                }
            } catch (e) {
                // when in office context unable to access external.
            }
        });   
    }
    );

export class Read {

    constructor() {
        //ko.applyBindings(new ReadViewModel());
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
            if (url && url.length > 0) {
                id = Utils.Utils.getParmFromHash(url[0], 'id');
            }
        }
        this.id = ko.observable(id);
        this.name = ko.observable(app.app.getName());
        this.email = ko.observable(app.app.getEmail()); 
        this.loading = ko.observable(true);  
        this.okClicked = ko.observable(false);
        this.showNameDialog = ko.computed(() => {
            if (this.name().length > 0 && this.email().length > 0) {
                return false;
            }
            this.loading(false);
            return !this.okClicked();            
        }, this);       
    }

    public id: KnockoutObservable<string>;
    public email: KnockoutObservable<string>;
    public name: KnockoutObservable<string>;
    public loading: KnockoutObservable<boolean>;
    public okClicked: KnockoutObservable<boolean>;
    public showNameDialog: any;

    public ok = () => {
        this.okClicked(true);
    };
};