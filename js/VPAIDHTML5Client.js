'use strict';

var utils = require('./utils');
var JSFrameCommunication = require('./JSFrameCommunication');
var unique = utils.unique('vpaidIframe');

function VPAIDHTML5Client(el, url, frameConfig, callback) {
    var id = unique();
    this._destroyed = false;
    this._ready = false;
    this._el = utils.createIframe(el, url + '?vpaidID=' + id);
    this._frame = new JSFrameCommunication(this._el, frameConfig.origin, frameConfig.allowed, id);
    this._frame.on('vpaid_handshake', function (err, result) {
        if(this.isDestroyed()) {return;}

        this._ready = true;

        if (callback) {
            callback(err, result);
        }

        if (this._autoLoad) {
            var autoLoad = this._autoLoad;
            delete this._autoLoad;
            this.loadAdUnit(autoLoad.url, autoLoad.callback);
        }

    }.bind(this));
}

VPAIDHTML5Client.prototype.destroy = function destroy() {
    this._destroyed = true;
}

VPAIDHTML5Client.prototype.isDestroyed = function isDestroyed() {
    return this._destroyed;
}

VPAIDHTML5Client.prototype.isReady = function isDestroyed() {
    return this._ready;
}

VPAIDHTML5Client.prototype.loadAdUnit = function loadAdUnit(adURL, callback) {
    if (this._ready) {
        this._frame.postMessage('method', 'loadAdUnit', adURL, function (err, msg) {
            if (!err) {
                this._adUnit = {};
            }
            callback(err, this._adUnit);
        }.bind(this));
    } else {
        this._autoLoad = {url: adURL, callback: callback};
    }
}

VPAIDHTML5Client.prototype.unloadAdUnit = function unloadAdUnit() {
    if (this._autoLoad) { delete this._autoLoad; }
}

VPAIDHTML5Client.prototype.getID = function () {
    return this._frame.getID();
}

module.exports = VPAIDHTML5Client;

