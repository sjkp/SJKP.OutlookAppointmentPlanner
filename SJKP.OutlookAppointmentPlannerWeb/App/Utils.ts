export module Utils {
    export var getParmFromHash = (url, parm) => {
        var re = new RegExp("#.*[?&]" + parm + "=([^&]+)(&|$)");
        var match = url.match(re);
        return (match ? match[1] : "");
    };
};