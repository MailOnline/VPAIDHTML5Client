(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var unique = require('./utils').unique;
var isTrue = require('./utils').constant(true);
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
    var win = this._targetFrame.postMessage ? this._targetFrame : this._targetFrame.contentWindow;
    win.postMessage(JSON.stringify(message), this._targetOrigin);
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

JSFrameCommunication.prototype.destroy = function destroy() {
    this.offAll();
    this._callbacks.removeAll();
}

JSFrameCommunication.HAND_SHAKE_EVENT = 'vpaid_handshake';

function _addListener(context, allowedOrigins) {
    var validateOrigin = (function () {
        return (allowedOrigins.indexOf('*') !== -1) ? isTrue : function (origin) {
            return allowedOrigins.indexOf(origin) !== -1;
        }
    })();

    window.addEventListener('message', function receiveMessage (e) {
        if (!validateOrigin(e.origin)) { return; }

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


},{"./registry":3,"./utils":4}],2:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var JSFrameCommunication = require('./JSFrameCommunication');

function VPAIDHTML5iFrame(id, frameConfig) {
    this._frame = new JSFrameCommunication(parent, frameConfig.origin, frameConfig.allowed, id);
    this._frame.postMessage('event', JSFrameCommunication.HAND_SHAKE_EVENT, [null, 'success']);
}

VPAIDHTML5iFrame.prototype.loadAdUnit = function loadAdUnit() {
//TODO
};

VPAIDHTML5iFrame.prototype.unloadAdUnit = function loadAdUnit() {
//TODO
};

module.exports = VPAIDHTML5iFrame;
window.VPAIDHTML5iFrame = VPAIDHTML5iFrame;


},{"./JSFrameCommunication":1,"./utils":4}],3:[function(require,module,exports){
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
    nEl.src = url || 'about:blank';
    nEl.width = 0;
    nEl.height = 0;
    parent.innerHTML = '';
    parent.appendChild(nEl);
    return nEl;
};

module.exports.simpleTemplate = function simpleTemplate(template, data) {
    Object.keys(data).forEach(function (key) {
        template = template.replace(new RegExp('{{' + key + '}}', 'g'), JSON.stringify(data[key]));
    });
    return template;
};

module.exports.setIframeContent = function setIframeContent(iframeEl, content) {
    var iframeDoc = getFrameDocument(iframeEl);
    if (!iframeDoc) return false;

    iframeDoc.open();
    iframeDoc.writeln(content);
    iframeDoc.close();

    return true;
};

module.exports.extend = function extend(toExtend, fromSource) {
  for (var key in fromSource) {
      if (fromSource.hasOwnProperty(key)) {
            toExtend[key] = fromSource[key];
          }
    }
  return toExtend;
};

module.exports.constant = function(value) {
    return function () {
        return value;
    };
};

function getFrameDocument (ifr) {
    return  ifr.document            ||
            ifr.contentDocument     ||
            ifr.contentWindow && ifr.contentWindow.document;
};

module.exports.unique = function unique(prefix) {
    var count = -1;
    return function () {
        return prefix + '_' + (++count);
    };
};


},{}]},{},[2])


//# sourceMappingURL=VPAIDHTML5iFrame.js.map