(function () {
    "use strict";

    module("DirectInput");

    test("Instantiation", function () {
        var input = $basicWidgets.DirectInput.create('text');

        equal(input.tagName, 'input', "should set tagName property");
        equal(input.htmlAttributes.getItem('type'), 'text', "should set type HTML attribute");
    });

    test("Input value setter", function () {
        expect(4);

        var input = $basicWidgets.DirectInput.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, undefined, "should set beforeValue property");
            equal(event.afterValue, 'foo', "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);

        strictEqual(input.setValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);
    });

    test("Input value removal", function () {
        expect(4);

        var input = $basicWidgets.DirectInput.create()
            .setValue('bar');

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'bar', "should set beforeValue property");
            strictEqual(event.afterValue, undefined, "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);

        strictEqual(input.clearValue(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);
    });
}());
