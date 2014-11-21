/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
///<reference path='App.ts'/>
///<reference path='Home/Home.ts'/>

/**
 * Main entry point for RequireJS
 */
declare var Office: any;

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
        //data: '../data',

        ////require plugins
        //text: '../vendor/require/text',
        //tpl: '../vendor/require/tpl',
        //json: '../vendor/require/json',
        //hbs: '../vendor/require-handlebars-plugin/hbs'
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

require(
    [
        'AppCompose/Home/Home',
        'jquery',
        'knockout',
        'knockout-jqueryui/datepicker',
    ],
    (Home, $, ko) => {
        'use strict';
        (<any>window).ko = ko;
        var home = new Home.Home();
        Office.initialize = home.initialize;
       
    }
    ); 