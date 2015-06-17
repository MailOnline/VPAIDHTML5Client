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

