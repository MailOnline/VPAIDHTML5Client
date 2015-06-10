module.exports.after = function after(count, handler) {
    return function () {
        count--;
        if (count <= 0) {
            handler();
        }
    };
}

module.exports.noop = function (){};

module.exports.framePostMessage = function (data) {
    var event = new CustomEvent('message');
    event.origin = '*';
    event.data = JSON.stringify(data);
    window.dispatchEvent(event);
};


module.exports.mockPostMessage = function (el, handler, context) {
    var contentWindow = {
        postMessage: function() {
            var args = arguments;
            setTimeout(function () {
                handler.apply(context, args);
            }, 0);
        }
    };

    Object.defineProperty(el, 'contentWindow', {
        get: function () {
            return contentWindow;
        }
    });
}

