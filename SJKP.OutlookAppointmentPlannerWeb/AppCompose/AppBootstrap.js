/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
/// <reference path="../Scripts/typings/office/office.d.ts" />
///<reference path='App.ts'/>
///<reference path='Home/Home.ts'/>
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
        App: '../App'
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

require(['knockout'], function (ko) {
    ko.components.register('signup', {
        viewModel: { require: '/App/Components/signup.js' },
        template: { require: 'text!/App/Components/signup.html' }
    });
});

require([
    'AppCompose/Home/Home',
    'jquery',
    'knockout',
    'knockout-jqueryui/datepicker'
], function (Home, $, ko) {
    'use strict';
    window.ko = ko;

    var home = new Home.Home();
    home.initialize();
    if (typeof (Office) === 'undefined') {
        //Debug mode
    } else {
        Office.initialize = home.initialize;
    }
});
//# sourceMappingURL=AppBootstrap.js.map
