/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
/// <reference path="../Scripts/typings/office/office.d.ts" />

/**
 * Main entry point for RequireJS
 */

var Office = Microsoft.Office.WebExtension;

require.config({

    baseUrl: '/Scripts/',

    paths: {
        //main libraries
        jquery: '/Scripts/jquery-2.1.4',
        knockout: '/Scripts/knockout-3.3.0',
        'jquery-ui': '/Scripts/jquery-ui',
        'knockout-jqueryui': '/Scripts/knockout-jqueryui',
        "moment": "/Scripts/moment",
        'knockout-bindings-date': '/Scripts/knockout.bindings.date',
        ////shortcut paths
        AppCompose: '../AppCompose',
        AppRead: '../AppRead',
        App: '../App',
    },

    shim: {
        jquery: {
            exports: '$'
        },
        'knockout': {
            exports: 'ko'
        }
    }
});

require(['knockout','knockout-bindings-date'], (ko) => {
    ko.components.register('signup', {
        viewModel: { require: '/App/Components/signup.js' },
        template: { require: 'text!/App/Components/signup.html' }
    });
});

require(['knockout'], (ko) => {
    ko.components.register('copyinput', {
        viewModel: { require: '/App/Components/copyinput.js' },
        template: { require: 'text!/App/Components/copyinput.html' }
    });
});

require(['knockout'], (ko) => {
    ko.components.register('spinner', {
        viewModel: { require: '/App/Components/spinner.js' },
        template: { require: 'text!/App/Components/spinner.html' }
    });
});

