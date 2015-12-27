(function () {
    "use strict";

    module("Button");

    test("Click emulation", function () {
        expect(2);

        var button = $basicWidgets.Button.create();

        button.addMocks({
            triggerSync: function (eventName) {
                equal(eventName, $basicWidgets.EVENT_BUTTON_CLICK,
                    "should trigger click event");
            }
        });

        strictEqual(button.clickButton(), button, "should be chainable");

        button.disableBy('foo');

        // should not trigger click when disabled
        button.clickButton();
    });
}());
