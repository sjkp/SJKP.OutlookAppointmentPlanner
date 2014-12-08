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
        jquery: '/Scripts/jquery-1.9.1',
        knockout: '/Scripts/knockout-3.2.0',
        'jquery-ui': '/Scripts/jquery-ui',
        'knockout-jqueryui': '/Scripts/knockout-jqueryui',
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

require(['knockout'], (ko) => {
    ko.components.register('signup', {
        viewModel: { require: '/App/Components/signup.js' },
        template: { require: 'text!/App/Components/signup.html' }
    });
});


