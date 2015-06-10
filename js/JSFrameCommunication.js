'use strict';

var unique = require('./utils').unique;
var SingleValueRegistry = require('./registry').SingleValueRegistry;
var MultipleValuesRegistry = require('./registry').MultipleValuesRegistry;


function JSFrameCommunication(targetFrame, targetOrigin, allowedOrigins, frameID) {
    this._targetFrame = targetFrame;
    this._targetOrigin = targetOrigin;
    this._callbacks = new SingleValueRegistry();
    this._subscribers = new MultipleValuesRegistry();
    this._frameID = frameID;
    this._uniqueCallbackID = unique(frameID);
    _addListener(this, allowedOrigins);
}

JSFrameCommunication.prototype.getID = function getID() {
    return this._frameID;
}

JSFrameCommunication.prototype.postMessage = function postMessage(type, typeDetail, msg, callback) {
    var message = {id: this._frameID, type: type, typeDetail: typeDetail, msg: msg};
    if (callback) {
        message.callbackID = this._addCallback(callback);
    }
    this._targetFrame.contentWindow.postMessage(JSON.stringify(message), this._targetOrigin);
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

JSFrameCommunication.prototype._addCallback = function _addCallback(callback) {
    var callbackID = this._uniqueCallbackID();
    this._callbacks.add(callbackID, callback);
    return callbackID;
}

JSFrameCommunication.prototype._trigger = function trigger(eventName, err, result) {
    this._subscribers.get(eventName).forEach(function (callback) {
        setTimeout(function () {
            callback(err, result);
        }, 0);
    });
};

JSFrameCommunication.prototype._fireCallback = function trigger(callbackID, err, result) {
    var callback = this._callbacks.get(callbackID);
    if (callback) {
        setTimeout(function () {
            callback(err, result);
        }.bind(this), 0);
    }
}


function _addListener(context, allowedOrigins) {
    window.addEventListener('message', function receiveMessage (e) {
        if (allowedOrigins.indexOf(e.origin) === -1) { return; }
        var data = JSON.parse(e.data);
        if (data.id !== context.getID()) { return; }

        if (data.type === 'event') {
            context._trigger.apply(context, [data.typeDetail].concat(data.msg));
        } else if (data.type === 'method') {
            context._fireCallback.apply(context, [data.callbackID].concat(data.msg));
        }

    });
}

module.exports = JSFrameCommunication;

