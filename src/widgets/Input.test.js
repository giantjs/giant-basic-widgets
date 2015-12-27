(function () {
    "use strict";

    module("Input");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.Input.create(1234);
        }, "should raise exception on invalid argument");

        var input = $basicWidgets.Input.create();
        equal(input.tagName, 'input', "should set tagName property to INPUT");
        equal(input.htmlAttributes.getItem('type'), 'text', "should set default type");

        equal($basicWidgets.Input.create('foo')
            .htmlAttributes.getItem('type'), 'foo', "should set input type");
    });

    test("Attribute addition override", function () {
        expect(6);

        var input = $basicWidgets.Input.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _setValueProxy: function (element, attrValue) {
                strictEqual(element, inputElement, "should call value setter proxy");
                equal(attrValue, 'foo', "should pass attribute value to proxy");
            }
        });

        $widget.Widget.addMocks({
            addAttribute: function (attrName, attrValue) {
                strictEqual(this, input, "should add attribute to input");
                equal(attrName, 'value', "should pass attribute name to setter");
                equal(attrValue, 'foo', "should pass attribute value to setter");
            }
        });

        strictEqual(input.addAttribute('value', 'foo'), input, "should be chainable");

        $widget.Widget.removeMocks();
    });

    test("Attribute removal override", function () {
        expect(5);

        var input = $basicWidgets.Input.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _setValueProxy: function (element, attrValue) {
                strictEqual(element, inputElement, "should call value setter proxy");
                equal(attrValue, '', "should pass empty string as value to proxy");
            }
        });

        $widget.Widget.addMocks({
            removeAttribute: function (attrName) {
                strictEqual(this, input, "should add attribute to input");
                equal(attrName, 'value', "should pass attribute name to setter");
            }
        });

        strictEqual(input.removeAttribute('value'), input, "should be chainable");

        $widget.Widget.removeMocks();
    });

    test("Input type getter", function () {
        expect(2);

        var input = $basicWidgets.Input.create(),
            attributeValue = {};

        input.htmlAttributes.addMocks({
            getItem: function (key) {
                equal(key, 'type', "should get type attribute");
                return attributeValue;
            }
        });

        strictEqual(input.getInputType(), attributeValue,
            "should forward value returned by htmlAttributes");
    });

    test("Input value setter", function () {
        expect(5);

        var input = $basicWidgets.Input.create();

        function onValueChange() {
            ok(true, "should trigger value change event");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, onValueChange);

        input.addMocks({
            getInputValue: function () {
                ok(true, "should get current input value");
                return 'bar';
            },

            addAttribute: function (attrName, attrValue) {
                equal(attrName, 'value', "should set value attribute");
                equal(attrValue, 'foo', "should set specified value");
            }
        });

        strictEqual(input.setInputValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_VALUE_CHANGE, onValueChange);
    });

    test("Input value removal", function () {
        expect(4);

        var input = $basicWidgets.Input.create();

        function onValueChange() {
            ok(true, "should trigger value change event");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, onValueChange);

        input.addMocks({
            getInputValue: function () {
                ok(true, "should get current input value");
                return 'bar';
            },

            removeAttribute: function (attrName) {
                equal(attrName, 'value', "should remove value attribute");
            }
        });

        strictEqual(input.clearInputValue(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_VALUE_CHANGE, onValueChange);
    });

    test("Input value getter", function () {
        expect(2);

        var input = $basicWidgets.Input.create(),
            attributeValue = {};

        input.htmlAttributes.addMocks({
            getItem: function (key) {
                equal(key, 'value', "should get value attribute");
                return attributeValue;
            }
        });

        strictEqual(input.getInputValue(), attributeValue,
            "should forward value returned by htmlAttributes");
    });

    test("Focusing", function () {
        expect(2);

        var input = $basicWidgets.Input.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _focusProxy: function (element) {
                strictEqual(element, inputElement, "should invoke focus proxy on input element");
            }
        });

        strictEqual(input.focusOnInput(), input, "should be chainable");
    });

    test("Blurring", function () {
        expect(2);

        var input = $basicWidgets.Input.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _blurProxy: function (element) {
                strictEqual(element, inputElement, "should invoke blur proxy on input element");
            }
        });

        strictEqual(input.blurInput(), input, "should be chainable");
    });

    test("Focus getter", function () {
        var input = $basicWidgets.Input.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _activeElementGetterProxy: function () {
                return inputElement;
            }
        });

        ok(input.isFocused(), "should return true when input element is active");

        input
            .removeMocks()
            .addMocks({
                getElement: function () {
                    return inputElement;
                },

                _activeElementGetterProxy: function () {
                    return 'foo';
                }
            });

        ok(!input.isFocused(), "should return false when input element is inactive");
    });
}());
