'use strict';

var IVPAIDAdUnit = require('./IVPAIDAdUnit');
var checkVPAIDInterface = IVPAIDAdUnit.checkVPAIDInterface;
var utils = require('./utils');
var METHODS = IVPAIDAdUnit.METHODS;

function VPAIDAdUnit(VPAIDCreative, el, video) {
    this._isValid = checkVPAIDInterface(VPAIDCreative);
    if (this._isValid) {
        this._creative = VPAIDCreative;
        this._el = el;
        this._videoEl = video;
    }
}

VPAIDAdUnit.prototype = Object.create(IVPAIDAdUnit.prototype);

VPAIDAdUnit.prototype.isValidVPAIDAd = function isValidVPAIDAd() {
    return this._isValid;
}

IVPAIDAdUnit.METHODS.forEach(function(method) {
    //this methods arguments order are implemented differently from the spec
    var ignores = [
        'subscribe',
        'unsubscribe',
        'initAd'
    ];

    if (ignores.indexOf(method) !== -1) return;

    VPAIDAdUnit.prototype[method] = function () {
        var ariaty = IVPAIDAdUnit.prototype[method].length;
        // TODO avoid leaking arguments
        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
        var args = Array.prototype.slice.call(arguments);
        var callback = (ariaty === args.length) ? args.pop() : undefined;

        setTimeout(function () {
            var result, error = null;
            try {
                result = this._creative[method].apply(this._creative, args);
            } catch(e) {
                error = e;
            }

            callOrTriggerEvent(callback, error, result);
        }.bind(this), 0);
    };
});


VPAIDAdUnit.prototype.initAd = function initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars, callback) {
    creativeData = utils.extend({slot: this._el}, creativeData || {})
    environmentVars = utils.extend({videoSlot: this._videoEl}, environmentVars || {});

    setTimeout(function () {
        var error;
        try {
            this._creative.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
        } catch (e) {
            error = e;
        }

        callOrTriggerEvent(callback, error);
    }.bind(this), 0);
};

VPAIDAdUnit.prototype.subscribe = function subscribe(event, handler, context) {
    this._creative.subscribe(handler, event, context);
};


VPAIDAdUnit.prototype.unsubscribe = function(event, handler) {
    this._creative.unsubscribe(handler, event);
};

//alias
VPAIDAdUnit.prototype.on = VPAIDAdUnit.prototype.subscribe;
VPAIDAdUnit.prototype.off = VPAIDAdUnit.prototype.unsubscribe;

IVPAIDAdUnit.GETTERS.forEach(function(getter) {
    VPAIDAdUnit.prototype[getter] = function (callback) {
        setTimeout(function () {

            var result, error = null;
            try {
                result = this._creative[getter]();
            } catch(e) {
                error = e;
            }

            callOrTriggerEvent(callback, error, result);
        }.bind(this), 0);
    };
});

//setters
VPAIDAdUnit.prototype.setAdVolume = function setAdVolume(volume, callback) {
    setTimeout(function () {

        var result, error = null;
        try {
            this._creative.setAdVolume(volume);
            result = this._creative.getAdVolume();
        } catch(e) {
            error = e;
        }

        if (!error) {
            error = utils.validate(!error && result !== volume, {msg: 'failed to apply volume: ' + volume});
        }
        callOrTriggerEvent(callback, error, result);
    }.bind(this), 0);
};


function callOrTriggerEvent(callback, error, result) {
    if (callback) {
        callback(error, result);
    } else if (error) {
        //todo use error subscribe
    }
}

module.exports = VPAIDAdUnit;

