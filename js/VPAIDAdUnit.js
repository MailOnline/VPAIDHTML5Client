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
VPAIDAdUnit.prototype.setAdVolume = function setAdVolume(volume) {
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

