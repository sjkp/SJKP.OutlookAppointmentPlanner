//https://gist.github.com/jasonmitchell/9260569#file-knockout-bindings-date-js

define(["require", "exports", "knockout", "moment"], function (require, exports, ko, moment)
{
ko.bindingHandlers.date = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
 
        // Date formats: http://momentjs.com/docs/#/displaying/format/
        var pattern = allBindings.format || 'DD/MM/YYYY';
 
        var output = "-";
        if (valueUnwrapped !== null && valueUnwrapped !== undefined) { //&& valueUnwrapped.length > 0
            output = moment(valueUnwrapped).format(pattern);
        }
 
        if ($(element).is("input") === true) {
            $(element).val(output);
        } else {
            $(element).text(output);
        }
    }
};
ko.bindingHandlers.hasSelectedFocus = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.bindingHandlers['hasfocus'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.bindingHandlers['hasfocus'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

        var selected = ko.utils.unwrapObservable(valueAccessor());
        if (selected) {
            element.select();
            element.setSelectionRange(0, element.value.length);
        }
    }
};
});