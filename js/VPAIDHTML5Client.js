'use strict';

function VPAIDHTML5Client() {
    this._destroyed = false;
    //todo create an iframe and wait for to handshake
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

