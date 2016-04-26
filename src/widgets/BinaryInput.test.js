(function () {
    "use strict";

    module("BinaryInput");

    test("Instantiation", function () {
        var input = $basicWidgets.BinaryInput.create('text');

        ok(input.hasOwnProperty('checked'), "should add checked property");
        equal(input.tagName, 'input', "should set tagName property");
        equal(input.htmlAttributes.getItem('type'), 'text', "should set type HTML attribute");
    });

    test("Value setter", function () {
        expect(5);

        var input = $basicWidgets.BinaryInput.create();

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'foo', "should set beforeValue property");
            equal(event.afterValue, 'bar', "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        strictEqual(input.setValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        equal(input.htmlAttributes.getItem('value'), 'foo', "should set value attribute");

        input.select();

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        input.setValue('bar');

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);
    });

    test("Value clearing", function () {
        expect(5);

        var input = $basicWidgets.BinaryInput.create()
            .setValue('foo');

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'foo', "should set beforeValue property");
            equal(event.afterValue, undefined, "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        strictEqual(input.clearValue(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        equal(input.htmlAttributes.getItem('value'), undefined, "should set value attribute");

        input
            .select()
            .setValue('foo');

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        input.clearValue();

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);
    });

    test("Value getter", function () {
        var input = $basicWidgets.BinaryInput.create()
            .setValue('foo');

        equal(input.getValue(), 'foo', "should return value attribute");
    });

    test("Selecting", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create()
            .setValue('foo');

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

        equal(input.checked, true, "should set checked property");
    });

    test("Checked state removal", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create()
            .setValue('foo')
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

        equal(input.checked, false, "should set checked property");
    });
}());
