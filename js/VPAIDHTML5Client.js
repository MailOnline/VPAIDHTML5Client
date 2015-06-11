'use strict';

var fs = require('fs');
var utils = require('./utils');
var JSFrameCommunication = require('./JSFrameCommunication');
var unique = utils.unique('vpaidIframe');
var template = fs.readFileSync(__dirname + '/iframe.template.html', 'utf8');

function VPAIDHTML5Client(el, url, frameConfig, callback) {
    this._destroyed = false;
    this._ready = false;
    this._id = unique();
    this._el = utils.createIframe(el);
    this._frame = _createFrameComm(
        this._el,
        {
            id: this._id,
            url: url + 'VPAIDHTML5iFrame.js',
            origin: frameConfig.origin,
            allowed: frameConfig.allowed
        },
        function(err, result) {
            this._ready = true;

            if (callback) {
                callback(err, result);
            }

            if (this._autoLoad) {
                var autoLoad = this._autoLoad;
                delete this._autoLoad;
                this.loadAdUnit(autoLoad.url, autoLoad.callback);
            }
        }.bind(this)
    );
}

VPAIDHTML5Client.prototype.destroy = function destroy() {
    this._destroyed = true;
    if (this._frame) {
        this._frame.destroy();
        this._frame = null;
    }
}

VPAIDHTML5Client.prototype.isDestroyed = function isDestroyed() {
    return this._destroyed;
}

VPAIDHTML5Client.prototype.isReady = function isReady() {
    return this._ready;
}

VPAIDHTML5Client.prototype.loadAdUnit = function loadAdUnit(adURL, callback) {
    $throwIfDestroyed.call(this);
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
    $throwIfDestroyed.call(this);
    return this._frame.getID();
}

function _createFrameComm(el, frameConfig, callback) {
    _setFrameContent(el, frameConfig);

    var frame = new JSFrameCommunication(el, frameConfig.origin, frameConfig.allowed, frameConfig.id);
    frame.on(JSFrameCommunication.HAND_SHAKE_EVENT, callback);

    return frame;
}

function _setFrameContent(iframe, data) {
    var html = utils.simpleTemplate(template, {
        iframeURL_JS: data.url,
        id: data.id,
        origin: data.origin,
        allowedOrigins: data.allowed
    });
    setTimeout(function () {
        utils.setIframeContent( iframe, html );
    }, 0);
}

function $throwIfDestroyed() {
    if (this._destroyed) {
        throw new Error ('VPAIDHTML5Client already destroyed!');
    }
}

module.exports = VPAIDHTML5Client;
window.VPAIDHTML5Client = VPAIDHTML5Client;

