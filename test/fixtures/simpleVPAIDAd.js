var IVPAIDAdUnit = require('../../js/IVPAIDAdUnit');

function LinearAd() {
    this._subscribers = {};
}

IVPAIDAdUnit.METHODS.forEach(function (key) {
    LinearAd.prototype[key] = function () {
        console.log('method called:', key);
    }
});

LinearAd.prototype.handshakeVersion = function (version) {
    return '1.1';
};

LinearAd.prototype.subscribe = function subscribe(handler, event, context) {
    if (!this._subscribers[event]) {
        this._subscribers[event] = [];
    }
    this._subscribers[event].push({callback: handler, context: context});
};


LinearAd.prototype.initAd = function initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars, callback) {
    $trigger.call(this, 'AdLoaded', 'some message event');
};

function $trigger(event, msg) {
    var subscribers = this._subscribers[event] || [];
    setTimeout(function() {
        subscribers.forEach(function(handlers) {
            if (handlers.context) {
                handlers.callback.call(handlers.context, msg);
            }else {
                handlers.callback(msg);
            }
        });
    }, 0);
}

window.getVPAIDAd = function() {
    return new LinearAd();
};

