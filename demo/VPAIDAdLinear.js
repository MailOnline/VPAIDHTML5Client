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
        icons: '',
        linear: true,
        remainingTime: 10,
        skippableState: false,
        viewMode: 'normal',
        width: 0,
        volume: 1.0,
        size: {
            height: 0,
            width: 0
        }
    };

    //open interactive panel -> AdExpandedChange, AdInteraction
    //when close panel -> AdExpandedChange, AdInteraction

    this._quartileEvents = [
        {event: 'AdVideoStart', position: 0},
        {event: 'AdVideoFirstQuartile', position: 25},
        {event: 'AdVideoMidpoint', position: 50},
        {event: 'AdSkippableStateChange', position: 65, hook: $enableSkippable.bind(this)},
        {event: 'AdVideoThirdQuartile', position: 75},
        {event: 'AdVideoComplete', position: 100}
    ];

    this._lastQuartilePosition = this._quartileEvents[0];

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
    this._attributes.size.width = width;
    this._attributes.size.height = height;
    this._attributes.viewMode = viewMode;
    this._attributes.desiredBitrate = desiredBitrate;

    this._slot = environmentVars.slot;
    this._videoSlot = environmentVars.videoSlot;
    this._style = _addCssLink('ad.css');

    try {
        this._parameters = JSON.parse(creativeData.AdParameters);
    } catch (e) {
        return $throwError('failed to parse creativeData.AdParameters, mandatory for this ad');
    }

    $setVideoAd.call(this);
    this._videoSlot.addEventListener('timeupdate', $onVideoUpdated.bind(this), false);
    this._videoSlot.addEventListener('ended', $onVideoEnded.bind(this), false);

    $trigger.call(this, 'AdLoaded');
};

/**
 * startAd
 *
 */
VPAIDAdLinear.prototype.startAd = function() {
    this._videoSlot.play();

    this._ui = {};
    this._ui.buy = _createAndAppend(this._slot, 'div', 'vpaidAdLinear');
    this._ui.banner = _createAndAppend(this._slot, 'div', 'banner');
    this._ui.xBtn = _createAndAppend(this._slot, 'button', 'close');
    this._ui.interact = _createAndAppend(this._slot, 'div', 'interact');

    this._ui.buy.addEventListener('click', $onClickThru.bind(this), false);
    this._ui.banner.addEventListener('click', $toggleExpand.bind(this, true), false);
    this._ui.xBtn.addEventListener('click', $toggleExpand.bind(this, false), false);

    $trigger.call(this, 'AdStarted');
};

/**
 * stopAd
 *
 */
VPAIDAdLinear.prototype.stopAd = function() {
    if (this._destroyed) return;

    $removeAll.call(this);
    $trigger.call(this, 'AdStopped');
};

/**
 * skipAd
 *
 */
VPAIDAdLinear.prototype.skipAd = function() {
    if (this._destroyed) return;
    if (!this._attributes.skippableState) return;

    $removeAll.call(this);
    $trigger.call(this, 'AdSkipped');
    $trigger.call(this, 'AdStopped');
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
    this._videoSlot.pause();
    $trigger.call(this, 'AdPaused');
};

/**
 * resumeAd
 *
 */
VPAIDAdLinear.prototype.resumeAd = function() {
    this._videoSlot.play();
    $trigger.call(this, 'AdPlaying');
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
};

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
    if (volume < 0 || volume > 1) return $throwError('volume is not valid');

    this._videoSlot.volume = volume;
    this._attributes.volume = volume;
};

function $enableSkippable() {
    this._attributes.skippableState = true;
}

function $onVideoUpdated() {
    if (this._destroyed) return;

    var videoSlot = this._videoSlot;
    var percentPlayed = _mapNumber(0, videoSlot.duration, 0, 100, videoSlot.currentTime);
    var last = this._lastQuartilePosition;

    if (percentPlayed < last.position) return;

    if (last.hook) last.hook();

    $trigger.call(this, last.event);

    var quartile = this._quartileEvents;
    this._lastQuartilePosition = quartile[ quartile.indexOf(last) + 1 ];
}

function $onVideoEnded() {
    if (this._destroyed) return;

    $removeAll.call(this);
    $trigger.call(this, 'AdStopped');
}

function $onClickThru() {
    var clickThru = this._parameters.clickThru || {
        url: 'http://www.dailymail.com',
        trackID: 123,
        playerHandles: false
    };

    $trigger.call(this, 'AdClickThru', [clickThru.url, clickThru.trackID, clickThru.playerHandles]);

    if (!clickThru.playerHandles) {
        window.open(clickThru.url, '_blank');
    }
}

function $removeAll() {
    this._destroyed = true;
    this._videoSlot.src = '';
    this._style.parentElement.removeChild(this._style);
    this._slot.innerHTML = '';
    this._ui = null;
}

function $throwError(msg) {
    $trigger.call(this, 'AdError', msg);
}

function $trigger(event, msg) {
    var subscribers = this._subscribers[event] || [];
    subscribers.forEach(function(handlers) {
        handlers.callback.apply(handlers.context, msg);
    });
}

function $setVideoAd() {
    var videoSlot = this._videoSlot;

    if (!videoSlot) {
        return $throwError.call(this, 'no video');
    }
    _setSize(videoSlot, this._attributes.size);

    if (!_setSupportedVideo(videoSlot, this._parameters.videos || [])) {
        return $throwError.call(this, 'no supported video found');
    }
}

function $toggleExpand(toExpand) {
    $toggleUI.call(this, toExpand);
    $togglePlay.call(this, toExpand);

    this._attributes.expandAd = toExpand;
    this._attributes.remainingTime = toExpand ? -2 : -1;

    $trigger.call(this, 'AdExpandedChange');
    $trigger.call(this, 'AdDurationChange');
}

function $togglePlay(toPlay) {
    if (toPlay) {
        this._videoSlot.pause();
    } else {
        this._videoSlot.play();
    }
}

function $toggleUI(show) {
    this._ui.interact.style.display = getDisplay();
    this._ui.xBtn.style.display = getDisplay();

    function getDisplay() {
        return show ? 'block' : 'none';
    }
}

function _setSize(el, size) {
    el.setAttribute('width', size.width);
    el.setAttribute('height', size.height);
    el.style.width = size.width + 'px';
    el.style.height = size.height + 'px';
}

function _setSupportedVideo(videoEl, videos) {
    var supportedVideos = videos.filter(function (video) {
        return videoEl.canPlayType(video.mimetype);
    });

    if (supportedVideos.length === 0) return false;

    videoEl.setAttribute('src', supportedVideos[0].url);

    return true;
}

function _createAndAppend(parent, tagName, className) {
    var el = document.createElement(tagName || 'div');
    el.className = className || '';
    parent.appendChild(el);
    return el;
}

function _addCssLink() {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'ad.css';
    parent.document.body.appendChild(css);
    return css;
}

function _normNumber(start, end, value) {
    return (value - start) / (end - start);
}

function _mapNumber(fromStart, fromEnd, toStart, toEnd, value) {
    return toStart + (toEnd - toStart) * _normNumber(fromStart, fromEnd, value);
}

window.getVPAIDAd = function() {
    return new VPAIDAdLinear();
};

})();


