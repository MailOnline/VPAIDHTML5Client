'use strict';


(function() {

/**
 * VPAIDAdLinear
 *
 * @class
 */
var VPAIDAdLinear = function VPAIDAdLinear() {
    this._slot = null;
    this._videoSlot = null;

    this._subscribers = {};

    this._attributes = {
        companions: '',
        desiredBitrate: 256,
        duration: 30,
        expanded: false,
        height: 0,
        width: 0,
        icons: '',
        linear: true,
        remainingTime: 10,
        skippableState: false,
        viewMode: 'normal',
        width: 0,
        volume: 1.0
    }

    this._quartileEvents = [
        {event: 'AdVideoStart', position: 0},
        {event: 'AdVideoFirstQuartile', position: 25},
        {event: 'AdVideoMidpoint', position: 50},
        {event: 'AdVideoThirdQuartile', position: 75},
        {event: 'AdVideoComplete', position: 100}
    ];

    this._lastQuartilePosition = 0;

    this._parameters = {};
};

/**
 * handshakeVersion
 *
 * @param {string} playerVPAIDVersion
 * @return {string} adUnit VPAID version format 'major.minor.patch' minimum '1.0'
 */
VPAIDAdLinear.prototype.handshakeVersion = function (playerVPAIDVersion) {
    return '2.0';
};

/**
 * initAd
 *
 * @param {number} width
 * @param {number} height
 * @param {string} viewMode
 * @param {number} desiredBitrate
 * @param {object} creativeData
 * @param {object} environmentVars
 */
VPAIDAdLinear.prototype.initAd = function initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this._attributes.width = width;
    this._attributes.height = height;
    this._attributes.viewMode = viewMode;
    this._attributes.desiredBitrate = desiredBitrate;

    try {
        this._parameters = JSON.parse(creativeData.AdParameters);
    } catch (e) {
        throw new Error('failed to parse creativeData.AdParameters, mandatory for this ad');
    }

    //TODO: do the rest

    $trigger.call(this, 'AdLoaded');
};

/**
 * startAd
 *
 */
VPAIDAdLinear.prototype.startAd = function() {
    //TODO
};

/**
 * stopAd
 *
 */
VPAIDAdLinear.prototype.stopAd = function() {
    //TODO
};

/**
 * skipAd
 *
 */
VPAIDAdLinear.prototype.skipAd = function() {
    //TODO
};

/**
 * resizeAd
 *
 */
VPAIDAdLinear.prototype.resizeAd = function() {
    //TODO
};

/**
 * pauseAd
 *
 */
VPAIDAdLinear.prototype.pauseAd = function() {
    //TODO
};

/**
 * resumeAd
 *
 */
VPAIDAdLinear.prototype.resumeAd = function() {
    //TODO
};

/**
 * expandAd
 *
 */
VPAIDAdLinear.prototype.expandAd = function() {
    //TODO
};

/**
 * collapseAd
 *
 */
VPAIDAdLinear.prototype.collapseAd = function() {
    //TODO
};


/**
 * subscribe
 *
 * @param {function} handler
 * @param {string} event
 * @param {object} context
 */
VPAIDAdLinear.prototype.subscribe = function subscribe(handler, event, context) {
    if (!this._subscribers[event]) {
        this._subscribers[event] = [];
    }
    this._subscribers[event].push({callback: handler, context: context});
};


/**
 * unsubscribe
 *
 * @param {function} handler
 * @param {string} event
 */
VPAIDAdLinear.prototype.unsubscribe = function unsubscribe(handler, event) {
    var eventSubscribers = this._subscribers[event];
    if (!Array.isArray(eventSubscribers)) return;

    this._subscribers[event] = eventSubscribers.filter(function (subscriber) {
        return handler !== subscriber;
    });
};

/**
 * getAdLinear
 *
 * @return {boolean}
 */
VPAIDAdLinear.prototype.getAdLinear = function getAdLinear() {
    return this._attributes.linear;
};

/**
 * getAdWidth
 *
 * @return {number} pixel's size of the ad, is equal to or less than the values passed in resizeAd/initAd
 */
VPAIDAdLinear.prototype.getAdWidth = function getAdWidth() {
    return this._attributes.width;
};

/**
 * getAdHeight
 *
 * @return {number} pixel's size of the ad, is equal to or less than the values passed in resizeAd/initAd
 */
VPAIDAdLinear.prototype.getAdHeight = function getAdHeight() {
    return this._attributes.height;
};

/**
 * getAdExpanded
 *
 * @return {boolean}
 */
VPAIDAdLinear.prototype.getAdExpanded = function getAdExpanded() {
    return this._attributes.expanded;
};

/**
 * getAdSkippableState - if the ad is in the position to be able to skip
 *
 * @return {boolean}
 */
VPAIDAdLinear.prototype.getAdSkippableState = function getAdSkippableState() {
    return this._attributes.skippableState;
};

/**
 * getAdRemainingTime
 *
 * @return {number} seconds, if not implemented will return -1, or -2 if the time is unknown (user is engaged with the ad)
 */
VPAIDAdLinear.prototype.getAdRemainingTime = function getAdRemainingTime() {};

/**
 * getAdDuration
 *
 * @return {number} seconds, if not implemented will return -1, or -2 if the time is unknown (user is engaged with the ad)
 */
VPAIDAdLinear.prototype.getAdDuration = function getAdDuration() {
    return this._attributes.duration;
};

/**
 * getAdVolume
 *
 * @return {number} between 0 and 1, if is not implemented will return -1
 */
VPAIDAdLinear.prototype.getAdVolume = function getAdVolume() {
    return this._attributes.volume;
}

/**
 * getAdCompanions - companions are banners outside the video player to reinforce the ad
 *
 * @return {string} VAST 3.0 formart string for <CompanionAds>
 */
VPAIDAdLinear.prototype.getAdCompanions = function getAdCompanions() {
    return this._attributes.companions;
};

/**
 * getAdIcons
 *
 * @return {boolean} if true videoplayer may hide is own icons to not duplicate
 */
VPAIDAdLinear.prototype.getAdIcons = function getAdIcons() {
    return this._attributes.icons;
};

/**
 * setAdVolume
 *
 * @param {number} volume  between 0 and 1
 */
VPAIDAdLinear.prototype.setAdVolume = function(volume) {
    if (volume < 0 || volume > 1) {
        throw new Error('volume is not valid');
    }
}


function $trigger(event) {
    var subscribers = this._subscribers[event] || [];
    subscribers.forEach(function(handlers) {
        if (handlers.context) {
            handlers.callback.call(handlers.context, msg);
        }else {
            handlers.callback(msg);
        }
    });
}


window.getVPAIDAd = function() {
    return new VPAIDAdLinear();
};

}();


