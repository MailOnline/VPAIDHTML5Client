'use strict';

module.exports.noop = function noop() {};

module.exports.createIframe = function createIframe(parent, url) {
    var nEl = document.createElement('iframe');
    nEl.src = url;
    parent.innerHTML = '';
    parent.appendChild(nEl);
    return nEl;
};

