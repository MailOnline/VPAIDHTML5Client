(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var noop = require('./utils').noop;

var METHODS = [
    'handshakeVersion',
    'initAd',
    'startAd',
    'stopAd',
    'skipAd',
    'resizeAd',
    'pauseAd',
    'resumeAd',
    'expandAd',
    'collapseAd',
    'subscribe',
    'unsubscribe'
];

var EVENTS = [
    'AdLoaded',
    'AdStarted',
    'AdStopped',
    'AdSkipped',
    'AdSkippableStateChange',
    'AdSizeChange',
    'AdLinearChange',
    'AdDurationChange',
    'AdExpandedChange',
    'AdRemainingTimeChange', // [Deprecated in 2.0] but will be still fired for backwards compatibility
    'AdVolumeChange',
    'AdImpression',
    'AdVideoStart',
    'AdVideoFirstQuartile',
    'AdVideoMidpoint',
    'AdVideoThirdQuartile',
    'AdVideoComplete',
    'AdClickThru',
    'AdInteraction',
    'AdUserAcceptInvitation',
    'AdUserMinimize',
    'AdUserClose',
    'AdPaused',
    'AdPlaying',
    'AdLog',
    'AdError'
];

var GETTERS = [
    'getAdLinear',
    'getAdWidth',
    'getAdHeight',
    'getAdExpanded',
    'getAdSkippableState',
    'getAdRemainingTime',
    'getAdDuration',
    'getAdVolume',
    'getAdCompanions',
    'getAdIcons'
];

var SETTERS = [
    'setAdVolume'
];


function IVPAIDAdUnit() {}

//methods
IVPAIDAdUnit.prototype.handshakeVersion = function (VPAIDVersion, callback) {};
IVPAIDAdUnit.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars, callback) {};
IVPAIDAdUnit.prototype.startAd = function(callback) {};
IVPAIDAdUnit.prototype.stopAd = function(callback) {};
IVPAIDAdUnit.prototype.skipAd = function(callback) {};
IVPAIDAdUnit.prototype.resizeAd = function(callback) {};
IVPAIDAdUnit.prototype.pauseAd = function(callback) {};
IVPAIDAdUnit.prototype.resumeAd = function(callback) {};
IVPAIDAdUnit.prototype.expandAd = function(callback) {};
IVPAIDAdUnit.prototype.collapseAd = function(callback) {};
IVPAIDAdUnit.prototype.subscribe = function(event, handler, context) {};
IVPAIDAdUnit.prototype.unsubscribe = function(event, handler) {};

//getters
IVPAIDAdUnit.prototype.getAdLinear = function(callback) {};
IVPAIDAdUnit.prototype.getAdWidth = function(callback) {};
IVPAIDAdUnit.prototype.getAdHeight = function(callback) {};
IVPAIDAdUnit.prototype.getAdExpanded = function(callback) {};
IVPAIDAdUnit.prototype.getAdSkippableState = function(callback) {};
IVPAIDAdUnit.prototype.getAdRemainingTime = function(callback) {};
IVPAIDAdUnit.prototype.getAdDuration = function(callback) {};
IVPAIDAdUnit.prototype.getAdVolume = function(callback) {};
IVPAIDAdUnit.prototype.getAdCompanions = function(callback) {};
IVPAIDAdUnit.prototype.getAdIcons = function(callback) {};

//setters
IVPAIDAdUnit.prototype.setAdVolume = function(volume, callback) {}

addStaticToInterface(IVPAIDAdUnit, 'METHODS', METHODS);
addStaticToInterface(IVPAIDAdUnit, 'GETTERS', GETTERS);
addStaticToInterface(IVPAIDAdUnit, 'SETTERS', SETTERS);

addStaticToInterface(IVPAIDAdUnit, 'checkVPAIDInterface', function checkVPAIDInterface (creative) {
    var result = METHODS.every(function(key) {
        return typeof creative[key] === 'function';
    });
    return result;
})

module.exports = IVPAIDAdUnit;

function addStaticToInterface(Interface, name, value) {
    Object.defineProperty(Interface, name, {
        writable: false,
        configurable: false,
        value: value
    });
}


},{"./utils":4}],2:[function(require,module,exports){
'use strict';

var IVPAIDAdUnit = require('./IVPAIDAdUnit');
var checkVPAIDInterface = IVPAIDAdUnit.checkVPAIDInterface;
var METHODS = IVPAIDAdUnit.METHODS;

function VPAIDAdUnit(VPAIDCreative) {
    this._isValid = checkVPAIDInterface(VPAIDCreative);
    if (this._isValid) {
        this._creative = VPAIDCreative;
    }
}

VPAIDAdUnit.prototype = Object.create(IVPAIDAdUnit.prototype);

VPAIDAdUnit.prototype.isValidVPAIDAd = function isValidVPAIDAd() {
    return this._isValid;
}

IVPAIDAdUnit.METHODS.forEach(function(method) {
    VPAIDAdUnit.prototype[method] = function () {
        var ariaty = IVPAIDAdUnit.prototype[method].length;
        setTimeout(function () {
            // TODO avoid leaking arguments
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
            var args = Array.prototype.slice.call(arguments);
            var callback = (ariaty === args.length) ? args.pop() : undefined;

            var result, error;
            try {
                this._creative[method].apply(this._creative, args);
            } catch(e) {
                error = e;
            }

            callOrTriggerEvent(callback, error, result);
        }, 0);
    };
});

//alias
VPAIDAdUnit.prototype.on = VPAIDAdUnit.prototype.subscribe;
VPAIDAdUnit.prototype.off = VPAIDAdUnit.prototype.unsubscribe;

IVPAIDAdUnit.GETTERS.forEach(function(getter) {
    VPAIDAdUnit.prototype[getter] = function (callback) {
        setTimeout(function () {

            var result, error;
            try {
                result = this._creative[getter]();
            } catch(e) {
                error = e;
            }

            callOrTriggerEvent(callback, error, result);
        }, 0);
    };
});

//setters
IVPAIDAdUnit.prototype.setAdVolume = function setAdVolume(volume) {
    setTimeout(function () {

        var result, error;
        try {
            this._creative.setAdVolume(volume);
            result = this._creative.getAdVolume();
        } catch(e) {
            error = e;
        }

        error = utils.validate(!error && result !== volume, {msg: 'failed to apply volume: ' + volume});
        callOrTriggerEvent(callback, error, result);
    }, 0);
};


function callOrTriggerEvent(callback, error, result) {
    if (callback) {
        callback(error, result);
    } else if (error) {
        //todo use error subscribe
    }
}

module.exports = VPAIDAdUnit;


},{"./IVPAIDAdUnit":1}],3:[function(require,module,exports){
'use strict';


var utils = require('./utils');
var unique = utils.unique('vpaidIframe');
var VPAIDAdUnit = require('./VPAIDAdUnit');
var defaultTemplate = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n</head>\n<body>\n    <script type=\"text/javascript\" src={{iframeURL_JS}}></script>\n    <script>\n        window.postMessage('{\"event\": \"ready\", \"id\": {{iframeID}}}', window.location.origin);\n    </script>\n</body>\n</html>\n";

function VPAIDHTML5Client(el, video, templateConfig, vpaidOptions) {
    templateConfig = templateConfig || {};

    this._id = unique();
    this._destroyed = false;

    this._el = utils.createElementInEl(el, 'div', this._id);
    this._frameContainer = utils.createElementInEl(this._el, 'div');
    this._adElContainer = utils.createElementInEl(this._el, 'div');
    this._videoEl = video;
    this._vpaidOptions = vpaidOptions || {timeout: 1000};

    this._templateConfig = {
        template: templateConfig.template || defaultTemplate,
        extraOptions: templateConfig.extraOptions || {}
    };

}

VPAIDHTML5Client.prototype.destroy = function destroy() {
    this._destroyed = true;
    this.unloadAdUnit();
}

VPAIDHTML5Client.prototype.isDestroyed = function isDestroyed() {
    return this._destroyed;
}

VPAIDHTML5Client.prototype.loadAdUnit = function loadAdUnit(adURL, callback) {
    $throwIfDestroyed.call(this);

    this._frame = utils.createIframeWithContent(
        this._frameContainer,
        this._templateConfig.template,
        utils.extend({
            iframeURL_JS: adURL,
            iframeID: this.getID()
        }, this._templateConfig.extraOptions)
    );

    //TODO maybe rethink the timeout if is too hidden logic
    this._onLoad = utils.callbackTimeout(
        this._vpaidOptions.timeout,
        onLoad.bind(this),
        onTimeout.bind(this)
    );

    window.addEventListener('message', this._onLoad);

    function onLoad (e) {
        //don't clear timeout
        if (e.origin !== window.location.origin) return;

        var result = JSON.parse(e.data);

        //don't clear timeout
        if (result.id !== this.getID()) return;

        var adUnit, error;
        if (!this._frame.contentWindow) {

            error = 'the iframe is not anymore in the DOM tree';

        } else {
            var createAd = this._frame.contentWindow.getVPAIDAd;
            error = utils.validate(typeof createAd !== 'function', 'the ad didn\'t return a function to create an ad');
        }

        if (!error) {
            adUnit = new VPAIDAdUnit(createAd());
            error = utils.validate(!adUnit.isValidVPAIDAd(), 'the add is not fully complaint with VPAID specification');
        }

        this._adUnit = adUnit;
        $destroyLoadListener.call(this);
        callback(error, error ? null : adUnit);

        //clear timeout
        return true;
    }

    function onTimeout() {
        callback('timeout', null);
    }
}

VPAIDHTML5Client.prototype.unloadAdUnit = function unloadAdUnit() {
    $destroyLoadListener.call(this);

    $removeEl.call(this, '_frame');
    $removeEl.call(this, '_adEl');

    if (this._adUnit) {
        this._adUnit.stopAd();
        delete this._adUnit;
    }

}

VPAIDHTML5Client.prototype.getID = function () {
    return this._id;
}

function $removeEl(key, parent) {
    if (this[key]) {
        this[key].parentElement.remove(this[key]);
        delete this[key];
    }
}

function $removeEl(key, parent) {
    if (this[key]) {
        this[key].parentElement.remove(this[key]);
        delete this[key];
    }
}

function $destroyLoadListener() {
    if (this._onLoad) {
        window.removeEventListener('load', this._onLoad);
        utils.clearCallbackTimeout(this._onLoad);
        delete this._onLoad;
    }
}

function $throwIfDestroyed() {
    if (this._destroyed) {
        throw new Error ('VPAIDHTML5Client already destroyed!');
    }
}

module.exports = VPAIDHTML5Client;
window.VPAIDHTML5Client = VPAIDHTML5Client;


},{"./VPAIDAdUnit":2,"./utils":4}],4:[function(require,module,exports){
'use strict';

function noop() {};

function validate(isValid, message) {
    return isValid ? message : null;
}

var timeouts = {};
function clearCallbackTimeout(func) {
    var timeout = timeouts[func];
    if (timeout) {
        clearTimeout(timeout);
        delete timeouts[func];
    }
}

function callbackTimeout(timer, onSuccess, onTimeout) {
    var callback, timeout;

    timeout = setTimeout(function () {
        onSuccess = noop;
        delete timeout[callback]
        onTimeout();
    }, timer);

    callback = function () {
        // TODO avoid leaking arguments
        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
        if (onSuccess.apply(this, arguments)) {
            clearCallbackTimeout(callback);
        }
    };

    timeouts[callback] = timeout;

    return callback;
}

function createElementInEl(parent, tagName, id) {
    var nEl = document.createElement(tagName);
    if (id) nEl.id = id;
    parent.appendChild(nEl);
    return nEl;
};

function createIframeWithContent(parent, template, data) {
    var iframe = createIframe(parent);
    if (!setIframeContent(iframe, simpleTemplate(template, data))) return;
    return iframe;
}

function createIframe(parent, url) {
    var nEl = document.createElement('iframe');
    nEl.src = url || 'about:blank';
    nEl.width = 0;
    nEl.height = 0;
    parent.innerHTML = '';
    parent.appendChild(nEl);
    return nEl;
};

function simpleTemplate(template, data) {
    Object.keys(data).forEach(function (key) {
        template = template.replace(new RegExp('{{' + key + '}}', 'g'), JSON.stringify(data[key]));
    });
    return template;
};

function setIframeContent(iframeEl, content) {
    var iframeDoc = iframeEl.contentWindow && iframeEl.contentWindow.document;
    if (!iframeDoc) return false;

    iframeDoc.write(content);

    return true;
};

function extend(toExtend, fromSource) {
    Object.keys(fromSource).forEach(function(key) {
        toExtend[key] = fromSource[key];
    });
    return toExtend;
};


function unique(prefix) {
    var count = -1;
    return function () {
        return prefix + '_' + (++count);
    };
};

module.exports = {
    noop: noop,
    validate: validate,
    clearCallbackTimeout: clearCallbackTimeout,
    callbackTimeout: callbackTimeout,
    createElementInEl: createElementInEl,
    createIframeWithContent: createIframeWithContent,
    createIframe: createIframe,
    simpleTemplate: simpleTemplate,
    setIframeContent: setIframeContent,
    extend: extend,
    unique: unique
}


},{}]},{},[3])


//# sourceMappingURL=VPAIDHTML5Client.js.map