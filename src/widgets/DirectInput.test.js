(function () {
    "use strict";

    module("DirectInput");

    test("Input value setter", function () {
        expect(3);

        var input = $basicWidgets.DirectInput.create();

        function onValueChange() {
            ok(true, "should trigger value change event");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);

        input.addMocks({
            getInputValue: function () {
                ok(true, "should get current input value");
                return 'bar';
            }
        });

        strictEqual(input.setInputValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);
    });

    test("Input value removal", function () {
        expect(3);

        var input = $basicWidgets.DirectInput.create();

        function onValueChange() {
            ok(true, "should trigger value change event");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);

        input.addMocks({
            getInputValue: function () {
                ok(true, "should get current input value");
                return 'bar';
            }
        });

        strictEqual(input.clearInputValue(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onValueChange);
    });
}());
