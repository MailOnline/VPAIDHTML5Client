'use strict';

var VPAID_JS_IFRAME_HANDLER = 'vpaid_js_handler';

function JSFrameCommunication(targetFrame, targetOrigin, allowedOrigins) {
    this._targetFrame = targetFrame;
    this._targetOrigin = targetOrigin;
    _addListener(this, allowedOrigins);
}

JSFrameCommunication.prototype.postMessage = function postMessage(type, typeDetail, msg) {
    this._targetFrame.postMessage(JSON.stringify({type: type, typeDetail: typeDetail, msg: msg}), this._targetOrigin);
}

function _addListener(context, origins) {
    window.addEventListener(VPAID_JS_IFRAME_HANDLER, function receiveMessage (e) {
        if (allowedOrigins.indexOf(e.origin) === -1) { return; }
        //TODO communication from iframe
    });
}

module.exports = JSFrameCommunication;

