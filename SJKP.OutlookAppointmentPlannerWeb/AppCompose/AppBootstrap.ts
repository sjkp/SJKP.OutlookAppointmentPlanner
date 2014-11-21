/// <reference path="../Scripts/typings/requirejs/require.d.ts" />
///<reference path='App.ts'/>
///<reference path='Home/Home.ts'/>

/**
 * Main entry point for RequireJS
 */
declare var Office: any;

require.config({

    //baseUrl: '/Scripts/',

    paths: {
        //main libraries
        jquery: '/Scripts/jquery-1.9.1',
        knockout: '/Scripts/knockout-3.2.0',

        ////shortcut paths
        //templates: '../templates',
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
        'Home/Home',
        'jquery',
        'knockout',
    ],
    (Home, $, ko) => {
        'use strict';
        (<any>window).ko = ko;
        var home = new Home.Home();
        Office.initialize = home.initialize;
       
    }
    ); 