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
    return '2.0';
};

LinearAd.prototype.subscribe = function subscribe(handler, event, context) {
    if (!this._subscribers[event]) {
        this._subscribers[event] = [];
    }
    this._subscribers[event].push({callback: handler, context: context});
};

LinearAd.prototype.initAd = partial($trigger, ['AdLoaded', '']);

LinearAd.prototype.startAd = partial($trigger, ['AdStarted', '']);

LinearAd.prototype.trigger = $trigger;
LinearAd.prototype.triggerSync = $triggerSync;

function partial(func, args) {
    return function() {
        func.apply(this, args.concat(arguments));
    }
}

function $trigger(event, msg) {
    setTimeout($triggerSync.bind(this, event, msg), 0);
}

function $triggerSync(event) {
    var subscribers = this._subscribers[event] || [];
    var args = Array.prototype.slice.call(arguments, 1);
    subscribers.forEach(function(handlers) {
        handlers.callback.apply(handlers.context, args);
    });
}

window.getVPAIDAd = function() {
    return new LinearAd();
};

module.exports = LinearAd;

