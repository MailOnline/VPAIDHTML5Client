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

