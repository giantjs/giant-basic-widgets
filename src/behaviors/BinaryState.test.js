(function () {
    "use strict";

    module("BinaryState");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.BinaryState.create();
        }, "should raise exception on missing arguments");

        var binaryState = $basicWidgets.BinaryState.create('foo');

        equal(binaryState.stateName, 'foo', "should set state name");
        ok(binaryState.stateSources.isA($data.Collection), "should add source collection");
        equal(binaryState.stateSources.getKeyCount(), 0, "should initialize source collection as empty");
        equal(binaryState.isCascading, false, "should set cascading flag to false");
    });

    test("Conversion from string", function () {
        var binaryState = 'foo'.toBinaryState();

        ok(binaryState.isA($basicWidgets.BinaryState), "should return BinaryState instance");
        equal(binaryState.stateName, 'foo', "should set state name");
    });

    test("Setting cascading flag", function () {
        var binaryState = 'foo'.toBinaryState();

        strictEqual(binaryState.setIsCascading(true), binaryState, "should be chainable");
        equal(binaryState.isCascading, true, "should set isCascading property");
    });

    test("Source addition", function () {
        var binaryState = 'foo'.toBinaryState();

        strictEqual(binaryState.addSource('bar'), binaryState, "should be chainable");
        deepEqual(binaryState.stateSources.items, {
            bar: true
        }, "should set source in collection");
    });

    test("Source removal", function () {
        var binaryState = 'foo'.toBinaryState()
            .addSource('bar')
            .addSource('baz');

        strictEqual(binaryState.removeSource('bar'), binaryState, "should be chainable");
        deepEqual(binaryState.stateSources.items, {
            baz: true
        }, "should remove source from collection");
    });

    test("Clearing all sources", function () {
        var binaryState = 'foo'.toBinaryState()
            .addSource('bar')
            .addSource('baz');

        strictEqual(binaryState.removeSource(), binaryState, "should be chainable");
        deepEqual(binaryState.stateSources.items, {
        }, "should clear source collection");
    });

    test("Source tested", function () {
        var binaryState = 'foo'.toBinaryState()
            .addSource('bar');

        ok(binaryState.hasSource('bar'), "should return true for source ID that's present");
        ok(!binaryState.hasSource('baz'), "should return false for absent source ID");
    });

    test("Source ID list getter", function () {
        var binaryState = 'foo'.toBinaryState()
            .addSource('bar')
            .addSource('baz');

        deepEqual(binaryState.getSourceIds().sort(), ['bar', 'baz'].sort(),
            "should return source IDs as array");
    });

    test("Source count getter", function () {
        var binaryState = 'foo'.toBinaryState();

        equal(binaryState.getSourceCount(), 0, "should return correct source count");

        binaryState.addSource('bar');
        equal(binaryState.getSourceCount(), 1, "should return correct source count");

        binaryState.addSource('baz');
        equal(binaryState.getSourceCount(), 2, "should return correct source count");
    });

    test("State tester", function () {
        var binaryState = 'foo'.toBinaryState();

        ok(!binaryState.isStateOn(), "should return false for zero sources");

        binaryState.addSource('bar');
        ok(binaryState.isStateOn(), "should return true for one or more sources");
    });
}());
