'use strict';

var SingleValueRegistry = require('./registry').SingleValueRegistry;
var MultipleValuesRegistry = require('./registry').MultipleValuesRegistry;

function JSFrameCommunication(targetFrame, targetOrigin, allowedOrigins, frameID) {
    this._targetFrame = targetFrame;
    this._targetOrigin = targetOrigin;
    this._subscribers = new MultipleValuesRegistry();
    this._frameID = frameID;
    _addListener(this, allowedOrigins);
}

JSFrameCommunication.prototype.getID = function getID() {
    return this._frameID;
}

JSFrameCommunication.prototype.postMessage = function postMessage(type, typeDetail, msg) {
    this._targetFrame.postMessage(JSON.stringify({id: this._frameID, type: type, typeDetail: typeDetail, msg: msg}), this._targetOrigin);
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

function _addListener(context, allowedOrigins) {
    window.addEventListener('message', function receiveMessage (e) {
        if (allowedOrigins.indexOf(e.origin) === -1) { return; }
        var data = JSON.parse(e.data);
        if (data.id !== context.getID()) { return; }

        context._trigger.apply(context, [data.typeDetail].concat(data.msg));
        //TODO handle callbacks
    });
}

module.exports = JSFrameCommunication;

