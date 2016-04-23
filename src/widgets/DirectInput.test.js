(function () {
    "use strict";

    module("DirectInput");

    test("Input value setter", function () {
        expect(5);

        var input = $basicWidgets.DirectInput.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'bar', "should set beforeValue property");
            equal(event.afterValue, 'foo', "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);

        input.addMocks({
            getValue: function () {
                ok(true, "should get current input value");
                return 'bar';
            }
        });

        strictEqual(input.setValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);
    });

    test("Input value removal", function () {
        expect(5);

        var input = $basicWidgets.DirectInput.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, 'bar', "should set beforeValue property");
            strictEqual(event.afterValue, undefined, "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);

        input.addMocks({
            getValue: function () {
                ok(true, "should get current input value");
                return 'bar';
            }
        });

        strictEqual(input.clearValue(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);
    });
}());
