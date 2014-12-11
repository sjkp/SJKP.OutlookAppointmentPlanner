export module Utils {
    export var getParmFromHash = (url, parm) => {
        var re = new RegExp("#.*[?&]" + parm + "=([^&]+)(&|$)");
        var match = url.match(re);
        return (match ? match[1] : "");
    };

    export var getBaseUrl = () => {
        var url = window.location.protocol + "//" + window.location.hostname;
        if (window.location.port.length > 0) {
            url += ":" + window.location.port;
        }
        return url;
    };
};