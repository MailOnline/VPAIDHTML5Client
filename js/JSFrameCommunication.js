'use strict';

var SingleValueRegistry = require('./registry').SingleValueRegistry;
var MultipleValuesRegistry = require('./registry').MultipleValuesRegistry;

var VPAID_JS_IFRAME_HANDLER = 'vpaid_js_handler';

function JSFrameCommunication(targetFrame, targetOrigin, allowedOrigins) {
    this._targetFrame = targetFrame;
    this._targetOrigin = targetOrigin;
    this._subscribers = new MultipleValuesRegistry();
    _addListener(this, allowedOrigins);
}

JSFrameCommunication.prototype.postMessage = function postMessage(type, typeDetail, msg) {
    this._targetFrame.postMessage(JSON.stringify({type: type, typeDetail: typeDetail, msg: msg}), this._targetOrigin);
}

JSFrameCommunication.prototype.on = function on(eventName, handler) {
    this._subscribers.add(eventName, handler);
}

JSFrameCommunication.prototype.off = function off(eventName, handler) {
    this._subscribers.remove(eventName, handler);
}

JSFrameCommunication.prototype.offEvent = function off(eventName) {
    this._subscribers.removeByKey(eventName);
}

JSFrameCommunication.prototype.offAll = function off() {
    this._subscribers.removeAll();
}

JSFrameCommunication.prototype._trigger = function trigger(eventName, err, result) {
    this._subscribers.get(eventName).forEach(function (callback) {
        setTimeout(function () {
            callback(err, result);
        }, 0);
    });
};

function _addListener(context, origins) {
    window.addEventListener(VPAID_JS_IFRAME_HANDLER, function receiveMessage (e) {
        if (allowedOrigins.indexOf(e.origin) === -1) { return; }
        //TODO communication from iframe
    });
}

module.exports = JSFrameCommunication;

