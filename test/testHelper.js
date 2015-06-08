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

