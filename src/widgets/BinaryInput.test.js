(function () {
    "use strict";

    module("BinaryInput");

    test("Instantiation", function () {
        var input = $basicWidgets.BinaryInput.create('text');

        ok(input.hasOwnProperty('selected'), "should add selected property");
        equal(input.tagName, 'input', "should set tagName property");
        equal(input.htmlAttributes.getItem('type'), 'text', "should set type HTML attribute");
    });

    test("Base value setter", function () {
        expect(5);

        var input = $basicWidgets.BinaryInput.create();

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'foo', "should set beforeValue property");
            equal(event.afterValue, 'bar', "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        strictEqual(input.setBaseValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        equal(input.htmlAttributes.getItem('value'), 'foo', "should set value attribute");

        input.select();

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        input.setBaseValue('bar');

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);
    });

    test("Value getter", function () {
        var input = $basicWidgets.BinaryInput.create()
            .setBaseValue('foo');

        equal(input.getBaseValue(), 'foo', "should return value attribute");
    });

    test("Selecting", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create()
            .setBaseValue('foo');

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            strictEqual(event.beforeValue, undefined, "should set beforeValue property");
            equal(event.afterValue, 'foo', "should set afterValue property");
        }

        input.addMocks({
            _updateDomChecked: function () {
                ok(true, "should update checked in DOM");
            }
        });

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        strictEqual(input.select(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        equal(input.selected, true, "should set selected property");
    });

    test("Checked state removal", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create()
            .setBaseValue('foo')
            .select();

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'foo', "should set beforeValue property");
            strictEqual(event.afterValue, undefined, "should set afterValue property");
        }

        input.addMocks({
            _updateDomChecked: function () {
                ok(true, "should update checked in DOM");
            }
        });

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        strictEqual(input.deselect(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        equal(input.selected, false, "should set selected property");
    });
}());
