(function () {
    "use strict";

    module("BinaryStateful");
    
    var base = $widget.Widget,
        BinaryStateful = base.extend('BinaryStateful')
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    $basicWidgets.BinaryStateful.init.call(this);
                },
    
                afterAdd: function () {
                    base.afterAdd.call(this);
                    $basicWidgets.BinaryStateful.afterAdd.call(this);
                },
    
                afterRemove: function () {
                    base.afterRemove.call(this);
                    $basicWidgets.BinaryStateful.afterRemove.call(this);
                },
    
                afterStateOn: function () {
    
                },
    
                afterStateOff: function () {
    
                }
            });
    
    test("Instantiation", function () {
        var binaryStateful = BinaryStateful.create();
    
        ok(binaryStateful.binaryStates.isA($data.Collection), "should add binaryStates property");
        equal(binaryStateful.binaryStates.getKeyCount(), 0,
            "should initialize states collection as empty");
    });
    
    test("Addition handler", function () {
        expect(3);
    
        var parent = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryState('bar', true)
                .setRootWidget(),
            child = BinaryStateful.create()
                .addBinaryState('foo', true);
    
        child.addMocks({
            _applyImposedState: function (stateName) {
                equal(stateName, 'foo', "should apply imposed sources for specified state");
            },
    
            isStateOn: function (stateName) {
                equal(stateName, 'foo', "should test parent's state");
                return true;
            },
    
            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should add imposed sources");
            }
        });
    
        child.addToParent(parent);
    });
    
    test("Removal handler", function () {
        var parent = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryStateSource('foo', 'hello')
                .setRootWidget(),
            child = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryState('bar', true)
                .addToParent(parent),
            removedStates = [];
    
        child.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                removedStates.push([stateName, sourceId]);
            }
        });
    
        child.removeFromParent();
    
        deepEqual(removedStates, [
            ['foo', 'imposed']
        ], "should remove parent imposed source from all states");
    });
    
    test("State addition", function () {
        var binaryStateful = BinaryStateful.create();
    
        strictEqual(binaryStateful.addBinaryState('foo', true), binaryStateful,
            "should be chainable");
    
        var state = binaryStateful.binaryStates.getItem('foo');
    
        ok(state.isA($basicWidgets.BinaryState),
            "should add BinaryState instance to binaryStates by specified name");

        ok(state.isCascading, "should set isCascading flag on state");

        binaryStateful.addBinaryState('foo');
    
        strictEqual(binaryStateful.binaryStates.getItem('foo'), state,
            "should not overwrite sources collection on subsequent addition");
    });
    
    test("State getter", function () {
        var binaryStateful = BinaryStateful.create()
            .addBinaryState('foo');
    
        equal(typeof binaryStateful.getBinaryState('bar'), 'undefined',
            "should return undefined for absent state");
        strictEqual(binaryStateful.getBinaryState('foo'),
            binaryStateful.binaryStates.getItem('foo'),
            "should return BinaryState instance for state already added");
    });
    
    test("State value getter", function () {
        var binaryStateful = BinaryStateful.create()
            .addBinaryState('foo');
    
        throws(function () {
            binaryStateful.isStateOn('bar');
        }, "should raise exception on absent state");
    
        ok(!binaryStateful.isStateOn('foo'), "should return falsey on zero associated sources");
    
        binaryStateful.addBinaryStateSource('foo', 'hello');
    
        ok(binaryStateful.isStateOn('foo'), "should return truthy on positive number of sources");
    });
    
    test("Source addition", function () {
        expect(6);
    
        var parent = BinaryStateful.create()
                .addBinaryState('foo'),
            child = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addToParent(parent);
    
        parent.addMocks({
            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should call after state handler");
            }
        });
    
        var i = 0;
        $basicWidgets.BinaryState.addMocks({
            addSource: function (sourceId) {
                equal(this.stateName, 'foo', "should add source to selected state");
                equal(sourceId, 'hello', "should add specified source to state");
            },
    
            getSourceCount: function () {
                return i++;
            }
        });
    
        BinaryStateful.addMocks({
            _addImposedState: function (stateName) {
                strictEqual(this, child, "should add imposed state to child");
                equal(stateName, 'foo', "should pass state name to imposed source setter");
            }
        });
    
        strictEqual(parent.addBinaryStateSource('foo', 'hello'), parent,
            "should be chainable");
    
        $basicWidgets.BinaryState.removeMocks();
        BinaryStateful.removeMocks();
    });
    
    test("Imposed source addition", function () {
        expect(4);
    
        var child = BinaryStateful.create()
            .addBinaryState('foo');
    
        child.addMocks({
            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should call after state handler");
            }
        });
    
        var i = 0;
        $basicWidgets.BinaryState.addMocks({
            addSource: function (sourceId) {
                equal(this.stateName, 'foo', "should add source to selected state");
                equal(sourceId, 'imposed', "should add imposed source to state");
            },
    
            getSourceCount: function () {
                return i++;
            }
        });
    
        strictEqual(child._addImposedState('foo'), child,
            "should be chainable");
    
        $basicWidgets.BinaryState.removeMocks();
    });
    
    test("Applying imposed source", function () {
        expect(2);
    
        var parent = BinaryStateful.create()
                .addBinaryState('foo')
                .addBinaryStateSource('foo', 'bar'),
            child = BinaryStateful.create()
                .addBinaryState('foo')
                .addToParent(parent);
    
        child.addMocks({
            _addImposedState: function (stateName) {
                equal(stateName, 'foo', "should pass state name to imposed source setter");
            }
        });
    
        strictEqual(child._applyImposedState('foo'), child,
            "should be chainable");
    });
    
    test("Source removal", function () {
        expect(6);
    
        var parent = BinaryStateful.create()
                .addBinaryState('foo', true),
            child = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addToParent(parent);
    
        parent.addMocks({
            afterStateOff: function (stateName) {
                equal(stateName, 'foo', "should call after handler");
            }
        });
    
        parent.addBinaryStateSource('foo', 'hello');
    
        var i = 1;
        $basicWidgets.BinaryState.addMocks({
            removeSource: function (sourceId) {
                equal(this.stateName, 'foo', "should remove source to selected state");
                equal(sourceId, 'world', "should remove specified source to state");
            },
    
            getSourceCount: function () {
                return i--;
            }
        });
    
        BinaryStateful.addMocks({
            _removeImposedState: function (stateName) {
                strictEqual(this, child, "should remove imposed state from child");
                equal(stateName, 'foo', "should pass state name to imposed source removal");
            }
        });
    
        strictEqual(parent.removeBinaryStateSource('foo', 'world'), parent,
            "should be chainable");
    
        $basicWidgets.BinaryState.removeMocks();
        BinaryStateful.removeMocks();
    });
    
    test("Source removal", function () {
        expect(4);
    
        var child = BinaryStateful.create()
            .addBinaryState('foo');
    
        child.addMocks({
            afterStateOff: function (stateName) {
                equal(stateName, 'foo', "should call after handler");
            }
        });
    
        var i = 1;
        $basicWidgets.BinaryState.addMocks({
            removeSource: function (sourceId) {
                equal(this.stateName, 'foo', "should remove source from selected state");
                equal(sourceId, 'imposed', "should remove imposed source from state");
            },
    
            getSourceCount: function () {
                return i--;
            }
        });
    
        strictEqual(child._removeImposedState('foo'), child,
            "should be chainable");
    
        $basicWidgets.BinaryState.removeMocks();
    });
    
    test("Cascading flag setter", function () {
        expect(5);
    
        var child = BinaryStateful.create()
            .addBinaryState('foo');
    
        child.addMocks({
            _applyImposedState: function (stateName) {
                equal(stateName, 'foo', "should apply imposed source on setting flag");
            }
        });
    
        strictEqual(child.setIsCascading('foo', true), child, "should be chainable");
    
        ok(child.getBinaryState('foo').isCascading, "should set cascading flag on setting");
    
        child
            .removeMocks()
            .addMocks({
                _removeImposedState: function (stateName) {
                    equal(stateName, 'foo', "should remove imposed source on un-setting flag");
                }
            });
    
        child.setIsCascading('foo', false);
    
        ok(!child.getBinaryState('foo').isCascading, "should un-set cascading flag on un-setting");
    
        child.removeMocks();
    });
}());
