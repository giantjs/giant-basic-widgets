(function () {
    "use strict";

    module("BinaryInput");

    test("Attribute addition override", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _setCheckedProxy: function (element, attrValue) {
                strictEqual(element, inputElement, "should call value setter proxy");
                equal(attrValue, true, "should pass attribute value to proxy");
            }
        });

        $basicWidgets.Input.addMocks({
            addAttribute: function (attrName, attrValue) {
                strictEqual(this, input, "should add attribute to input");
                equal(attrName, 'checked', "should pass attribute name to setter");
                equal(attrValue, true, "should pass attribute value to setter");
            }
        });

        strictEqual(input.addAttribute('checked', true), input, "should be chainable");

        $basicWidgets.Input.removeMocks();
    });

    test("Attribute removal override", function () {
        expect(5);

        var input = $basicWidgets.BinaryInput.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _setCheckedProxy: function (element, attrValue) {
                strictEqual(element, inputElement, "should call value setter proxy");
                equal(attrValue, false, "should pass false as value to proxy");
            }
        });

        $basicWidgets.Input.addMocks({
            removeAttribute: function (attrName) {
                strictEqual(this, input, "should add attribute to input");
                equal(attrName, 'checked', "should pass attribute name to setter");
            }
        });

        strictEqual(input.removeAttribute('checked'), input, "should be chainable");

        $basicWidgets.Input.removeMocks();
    });

    test("Checked state setter", function () {
        expect(3);

        var input = $basicWidgets.BinaryInput.create();

        function onStateChange() {
            ok(true, "should trigger value change event");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        input.addMocks({
            getChecked: function () {
                ok(true, "should get current checked state");
                return false;
            }
        });

        strictEqual(input.setChecked(true), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);
    });

    test("Checked state removal", function () {
        expect(3);

        var input = $basicWidgets.BinaryInput.create();

        function onStateChange() {
            ok(true, "should trigger value change event");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);

        input.addMocks({
            getChecked: function () {
                ok(true, "should get current checked state");
                return true;
            }
        });

        strictEqual(input.clearChecked(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_STATE_CHANGE, onStateChange);
    });

    test("Checked state getter", function () {
        expect(2);

        var input = $basicWidgets.BinaryInput.create(),
            attributeValue = {};

        input.htmlAttributes.addMocks({
            getItem: function (key) {
                equal(key, 'checked', "should get checked attribute");
                return attributeValue;
            }
        });

        strictEqual(input.getChecked(), attributeValue,
            "should forward value returned by htmlAttributes");
    });
}());
