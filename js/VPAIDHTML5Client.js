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

