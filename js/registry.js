'use strict';

function Registry() {
    this._registries = {};
}

function $removeByKey(id) {
    var old = this._registries[id];
    delete this._registries[id];
    return old;
}

function $removeByValueHelper(value, handler) {
    var keys = this.findByValue(value);
    return keys.map(handler.bind(this));
}

Registry.prototype.add = function() {};
Registry.prototype.get = function() {};
Registry.prototype.remove = function (key) {};
Registry.prototype.findByValue = function () {};
Registry.prototype.removeByValue = function (value) {};

Registry.prototype.filterKeys = function filterKeys(handler) {
    return Object.keys(this._registries).filter(handler);
};

Registry.prototype.removeAll = function removeAll() {
    var old = this._registries;
    this._registries = {};
    return old;
};

Registry.prototype.size = function size() {
    return Object.keys(this._registries).length;
};

/*
 * MultipleValuesRegistry
 */
function MultipleValuesRegistry() {
    Registry.call(this);
}

MultipleValuesRegistry.prototype = Object.create(Registry.prototype);
MultipleValuesRegistry.prototype.removeByKey = $removeByKey;

MultipleValuesRegistry.prototype.add = function add(id, value) {
    if (!this._registries[id]) {
        this._registries[id] = [];
    }
    if (this._registries[id].indexOf(value) === -1) {
        this._registries[id].push(value);
    }
};

MultipleValuesRegistry.prototype.get = function get(id) {
    return this._registries[id] || [];
};

MultipleValuesRegistry.prototype.findByValue = function findByValue(value) {
    var registries = this._registries;
    var keys = Object.keys(registries).filter(function(key) {
        return registries[key].indexOf(value) !== -1;
    });
    return keys;
};

MultipleValuesRegistry.prototype.remove = function remove(key, value) {
    if (!this._registries[key]) { return; }

    var index = this._registries[key].indexOf(value);

    if (index < 0) { return; }
    return this._registries[key].splice(index, 1);
};

MultipleValuesRegistry.prototype.removeByValue = function removeByValue(value) {
    $removeByValueHelper.call(this, value, function (key) {
        this.remove(key, value);
    });
};

/*
 * SingleValueRegistry
 */

function SingleValueRegistry () {
    Registry.call(this);
}

SingleValueRegistry.prototype = Object.create(Registry.prototype);
SingleValueRegistry.prototype.remove = $removeByKey;

SingleValueRegistry.prototype.add = function add(id, value) {
    this._registries[id] = value;
};

SingleValueRegistry.prototype.get = function get(id) {
    return this._registries[id];
};

SingleValueRegistry.prototype.findByValue = function findByValue(value) {
    var registries = this._registries;
    var keys = Object.keys(registries).filter(function (key) {
        return registries[key] === value;
    });
    return keys;
};

SingleValueRegistry.prototype.removeByValue = function removeByValue(value) {
    $removeByValueHelper.call(this, value, function (key) {
        this.remove(key);
    });
};

module.exports.MultipleValuesRegistry = MultipleValuesRegistry;
module.exports.SingleValueRegistry = SingleValueRegistry;

