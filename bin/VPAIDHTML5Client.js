(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var JSFrameCommunication = require('./JSFrameCommunication');

function VPAIDHTML5Client(el, url, frameConfig, callback) {
    this._destroyed = false;
    this._el = utils.createIframe(el, url);
    this._frame = new JSFrameCommunication(this._el, frameConfig.origin, frameConfig.allowed);
    this._frame.on('handshake', function (err, result) {
        if(this.isDestroyed()) {return;}
        callback(err, result);
    }.bind(this));
}

VPAIDHTML5Client.prototype.destroy = function destroy() {
    this._destroyed = true;
}

VPAIDHTML5Client.prototype.isDestroyed = function isDestroyed() {
    return this._destroyed;
}

VPAIDHTML5Client.prototype.loadAdUnit = function loadAdUnit() {
}

VPAIDHTML5Client.prototype.unloadAdUnit = function unloadAdUnit() {
}

module.exports = VPAIDHTML5Client;


},{"./JSFrameCommunication":2,"./utils":4}],2:[function(require,module,exports){
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


},{"./registry":3}],3:[function(require,module,exports){
'use strict';

function Registry() {
    this._registries = {};
}

function $removeByKey(id) {
    var old = this._registries[id];
    delete this._registries[id];
    return old;
}

function $removeByValueHelper(value, handler) {
    var keys = this.findByValue(value);
    return keys.map(handler.bind(this));
}

Registry.prototype.add = function() {};
Registry.prototype.get = function() {};
Registry.prototype.remove = function (key) {};
Registry.prototype.findByValue = function () {};
Registry.prototype.removeByValue = function (value) {};

Registry.prototype.filterKeys = function filterKeys(handler) {
    return Object.keys(this._registries).filter(handler);
};

Registry.prototype.removeAll = function removeAll() {
    var old = this._registries;
    this._registries = {};
    return old;
};

Registry.prototype.size = function size() {
    return Object.keys(this._registries).length;
};

/*
 * MultipleValuesRegistry
 */
function MultipleValuesRegistry() {
    Registry.call(this);
}

MultipleValuesRegistry.prototype = Object.create(Registry.prototype);
MultipleValuesRegistry.prototype.removeByKey = $removeByKey;

MultipleValuesRegistry.prototype.add = function add(id, value) {
    if (!this._registries[id]) {
        this._registries[id] = [];
    }
    if (this._registries[id].indexOf(value) === -1) {
        this._registries[id].push(value);
    }
};

MultipleValuesRegistry.prototype.get = function get(id) {
    return this._registries[id] || [];
};

MultipleValuesRegistry.prototype.findByValue = function findByValue(value) {
    var registries = this._registries;
    var keys = Object.keys(registries).filter(function(key) {
        return registries[key].indexOf(value) !== -1;
    });
    return keys;
};

MultipleValuesRegistry.prototype.remove = function remove(key, value) {
    if (!this._registries[key]) { return; }

    var index = this._registries[key].indexOf(value);

    if (index < 0) { return; }
    return this._registries[key].splice(index, 1);
};

MultipleValuesRegistry.prototype.removeByValue = function removeByValue(value) {
    $removeByValueHelper.call(this, value, function (key) {
        this.remove(key, value);
    });
};

/*
 * SingleValueRegistry
 */

function SingleValueRegistry () {
    Registry.call(this);
}

SingleValueRegistry.prototype = Object.create(Registry.prototype);
SingleValueRegistry.prototype.remove = $removeByKey;

SingleValueRegistry.prototype.add = function add(id, value) {
    this._registries[id] = value;
};

SingleValueRegistry.prototype.get = function get(id) {
    return this._registries[id];
};

SingleValueRegistry.prototype.findByValue = function findByValue(value) {
    var registries = this._registries;
    var keys = Object.keys(registries).filter(function (key) {
        return registries[key] === value;
    });
    return keys;
};

SingleValueRegistry.prototype.removeByValue = function removeByValue(value) {
    $removeByValueHelper.call(this, value, function (key) {
        this.remove(key);
    });
};

module.exports.MultipleValuesRegistry = MultipleValuesRegistry;
module.exports.SingleValueRegistry = SingleValueRegistry;


},{}],4:[function(require,module,exports){
'use strict';

module.exports.noop = function noop() {};

module.exports.createIframe = function createIframe(parent, url) {
    var nEl = document.createElement('iframe');
    nEl.src = url;
    parent.innerHTML = '';
    parent.appendChild(nEl);
    return nEl;
};


},{}]},{},[1])


//# sourceMappingURL=VPAIDHTML5Client.js.map