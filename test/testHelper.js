'use stirict';

module.exports.after = function after(count, handler) {
    return function () {
        count--;
        if (count <= 0) {
            handler();
        }
    };
};

module.exports.noop = function (){};

module.exports.triggerEvent = function(vpaid, type) {
    var event = new Event(type);
    vpaid._frame.dispatchEvent(event);
};

module.exports.framePostMessage = function (data) {
    var event = new CustomEvent('message');
    event.origin = window.location.origin;
    event.data = JSON.stringify(data);
    window.dispatchEvent(event);
};

module.exports.getBrowserifyPath = function () {
    var el = document.querySelector('script[src*=browserify]');
    return el.getAttribute('src');
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
};

module.exports.implementsProperties = function implements(creative, array) {
    return array.every(function (key) {
        return typeof creative[key] === 'function';
    });
};

module.exports.iframeTemplate = '' +
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '    <meta charset="UTF-8">' +
    '</head>' +
    '<body>' +
    '    <script>' +
    '        window.console = window.parent.console; // use parent console that have enhanced by test environment' +
    '    </script>' +
    '    <script type="text/javascript" src="{{browserify_JS}}"></script>' +
    '    <script type="text/javascript" src="{{iframeURL_JS}}"></script>' +
    '    <script>' +
    '        parent.postMessage(\'{"event": "ready", "id": "{{iframeID}}"}\', window.location.origin);' +
    '    </script>' +
    '    <div class="ad-element">' +
    '    </div>' +
    '</body>' +
    '</html>';

