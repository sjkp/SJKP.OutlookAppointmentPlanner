///<amd-dependency path="knockout" />
///<reference path="../../Scripts/typings/knockout/knockout.d.ts" />
///<reference path="../../Scripts/typings/office/office.d.ts" />
///<reference path="../../App/Utils.ts" />
define(["require", "exports", 'App/App', 'App/Utils', "knockout"], function(require, exports, app, Utils) {
    var Office = Microsoft.Office.WebExtension;

    require([
        'jquery',
        'knockout',
        'knockout-jqueryui/datepicker'
    ], function ($, ko) {
        'use strict';
        window.ko = ko;
        var home = new Home();

        //home.initialize();
        Office.initialize = home.initialize;
    });

    var Home = (function () {
        function Home() {
        }
        // The initialize function must be run each time a new page is loaded
        Home.prototype.initialize = function (reason) {
            $(document).ready(function () {
                app.app.initialize();
                ko.applyBindings(new ReadViewModel());
            });
        };
        return Home;
    })();
    exports.Home = Home;
    ;

    var ReadViewModel = (function () {
        function ReadViewModel() {
            var _this = this;
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
            this.showNameDialog = ko.computed(function () {
                if (_this.name().length > 0 && _this.email().length > 0) {
                    return false;
                }
                return true;
            }, this);
        }
        return ReadViewModel;
    })();
    exports.ReadViewModel = ReadViewModel;
    ;
});
//# sourceMappingURL=Home.js.map
