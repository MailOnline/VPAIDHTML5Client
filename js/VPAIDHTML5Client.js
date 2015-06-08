'use strict';

var utils = require('./utils');
var JSFrameCommunication = require('./JSFrameCommunication');
var unique = utils.unique('vpaidIframe');

function VPAIDHTML5Client(el, url, frameConfig, callback) {
    var id = unique();
    this._destroyed = false;
    this._el = utils.createIframe(el, url + '?vpaidID=' + id);
    this._frame = new JSFrameCommunication(this._el, frameConfig.origin, frameConfig.allowed, id);
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

VPAIDHTML5Client.prototype.getID = function () {
    return this._frame.getID();
}

module.exports = VPAIDHTML5Client;

