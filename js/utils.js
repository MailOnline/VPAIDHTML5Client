'use strict';

module.exports.noop = function noop() {};

module.exports.createIframe = function createIframe(parent, url) {
    var nEl = document.createElement('iframe');
    nEl.src = url || 'about:blank';
    nEl.width = 0;
    nEl.height = 0;
    parent.innerHTML = '';
    parent.appendChild(nEl);
    return nEl;
};

module.exports.simpleTemplate = function simpleTemplate(template, data) {
    Object.keys(data).forEach(function (key) {
        template = template.replace(new RegExp('{{' + key + '}}', 'g'), JSON.stringify(data[key]));
    });
    return template;
};

module.exports.setIframeContent = function setIframeContent(iframeEl, content) {
    var iframeDoc = getFrameDocument(iframeEl);
    if (!iframeDoc) return false;

    iframeDoc.open();
    iframeDoc.writeln(content);
    iframeDoc.close();

    return true;
};

module.exports.extend = function extend(toExtend, fromSource) {
  for (var key in fromSource) {
      if (fromSource.hasOwnProperty(key)) {
            toExtend[key] = fromSource[key];
          }
    }
  return toExtend;
};

module.exports.constant = function(value) {
    return function () {
        return value;
    };
};

function getFrameDocument (ifr) {
    return  ifr.document            ||
            ifr.contentDocument     ||
            ifr.contentWindow && ifr.contentWindow.document;
};

module.exports.unique = function unique(prefix) {
    var count = -1;
    return function () {
        return prefix + '_' + (++count);
    };
};

