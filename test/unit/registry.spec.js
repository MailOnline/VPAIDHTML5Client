var SingleValueRegistry = require('../../js/registry.js').SingleValueRegistry;
var MultipleValuesRegistry = require('../../js/registry.js').MultipleValuesRegistry;

describe('registry.js SingleValueRegistry', function()  {
    var registry;
    beforeEach(function() {
        registry = new SingleValueRegistry();
    });
    it('implements add', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data1);
        assert.equal(registry._registries[key], data1);

        registry.add(key, data2);
        assert.equal(registry._registries[key], data2);
    });
    it('implements get', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1', key2 = 'hello2';

        registry.add(key1, data1);
        assert.equal(registry.get(key1), data1);

        registry.add(key2, data2);
        assert.equal(registry.get(key2), data2);
    });
    it('implements findByValue', function () {
        var data = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data);
        assert.equal(registry.findByValue(data)[0], key);
    });
    it('implements remove', function () {
        var data = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data);
        assert.equal(registry._registries[key], data);

        registry.remove(key);
        assert.isUndefined(registry._registries[key]);
    });
    it('implements removeByValue', function () {
        var data = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data);
        assert.equal(registry._registries[key], data);

        registry.removeByValue(data);
        assert.isUndefined(registry._registries[key]);
    });
    it('implements removeAll', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1', key2 = 'hello2';

        registry.add(key1, data1);
        registry.add(key2, data2);

        registry.removeAll();

        assert.isUndefined(registry[key1]);
        assert.isUndefined(registry[key2]);
        assert.equal(registry.size(), 0);
    });
    it('implements size', function () {
        var data1 = {}, data2 = {hello: 'hello'};

        registry.add('hello1', data1);
        registry.add('hello2', data2);

        assert.equal(registry.size(), 2);
    });
});

describe('registry.js MultipleValuesRegistry', function()  {
    var registry;
    beforeEach(function() {
        registry = new MultipleValuesRegistry();
    });
    it('implements add', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data1);
        assert.equal(registry._registries[key][0], data1);

        registry.add(key, data2);
        assert.equal(registry._registries[key][1], data2);
    });
    it('implements get', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data1);
        assert.equal(registry.get(key)[0], data1);

        registry.add(key, data2);
        assert.equal(registry.get(key)[1], data2);
    });
    it('implements findByValue', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1', key2 = 'hello2';

        registry.add(key1, data1);
        registry.add(key1, data2);
        registry.add(key2, data1);

        assert.equal(registry.get(key1)[0], data1);
        assert.equal(registry.get(key1)[1], data2);
        assert.equal(registry.get(key2)[0], data1);

        assert.deepEqual(registry.findByValue(data1), [key1, key2]);
    });
    it('implements remove', function () {
        var data = {hello: 'hello'};
        var key = 'hello';

        registry.add(key, data);
        assert.equal(registry._registries[key][0], data);

        registry.remove(key, data);
        assert.isUndefined(registry._registries[key][0]);
    });
    it('implements removeByKey', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1';

        registry.add(key1, data1);
        registry.add(key1, data2);

        registry.removeByKey(key1);

        assert.deepEqual(registry.get(key1), []);
    });
    it('implements removeByValue', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1', key2 = 'hello2';

        registry.add(key1, data1);
        registry.add(key1, data2);
        registry.add(key2, data1);

        assert.equal(registry.get(key1)[0], data1);
        assert.equal(registry.get(key1)[1], data2);
        assert.equal(registry.get(key2)[0], data1);

        registry.removeByValue(data1);

        assert.deepEqual(registry.get(key1), [data2]);
        assert.deepEqual(registry.get(key2), []);
    });
    it('implements removeAll', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1', key2 = 'hello2';

        registry.add(key1, data1);
        registry.add(key1, data2);
        registry.add(key2, data1);

        registry.removeAll();

        assert.isUndefined(registry[key1]);
        assert.isUndefined(registry[key2]);
        assert.equal(registry.size(), 0);
    });
    it('implements size', function () {
        var data1 = {}, data2 = {hello: 'hello'};
        var key1 = 'hello1', key2 = 'hello2';

        registry.add(key1, data1);
        registry.add(key1, data2);
        registry.add(key2, data1);

        assert.equal(registry.size(), 2);
    });

});

