(function () {
    "use strict";

    module("Input");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.Input.create(1234);
        }, "should raise exception on invalid argument");

        var input = $basicWidgets.Input.create('text');
        equal(input.tagName, 'input', "should set tagName property to INPUT");
        equal(input.htmlAttributes.getItem('type'), 'text', "should set input type");
    });

    test("State-on handler override", function () {
        expect(1);

        var input = $basicWidgets.Input.create('text');

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.disableBy('foo');
    });

    test("State-off handler override", function () {
        expect(1);

        var input = $basicWidgets.Input.create('text')
            .disableBy('foo');

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.enableBy('foo');
    });

    test("Attribute addition override", function () {
        expect(7);

        var input = $basicWidgets.Input.create('text'),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _getValueProxy: function (element) {
                strictEqual(element, inputElement, "should call value getter proxy");
                return '';
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
        expect(6);

        var input = $basicWidgets.Input.create('text'),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _getValueProxy: function (element) {
                strictEqual(element, inputElement, "should call value getter proxy");
                return 'foo';
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

    test("Label widget setter", function () {
        var input = $basicWidgets.Input.create('text'),
            label = $basicWidgets.Text.create();

        strictEqual(input.linkLabelWidget(label), input, "should be chainable");
        equal(label.tagName, 'label', "should change label tagName property to 'label'");
        equal(label.htmlAttributes.getItem('for'), input.htmlAttributes.idAttribute,
            "should set 'for' attribute to input ID");
    });

    test("Input type getter", function () {
        expect(2);

        var input = $basicWidgets.Input.create('text'),
            attributeValue = {};

        input.htmlAttributes.addMocks({
            getItem: function (key) {
                equal(key, 'type', "should get type attribute");
                return attributeValue;
            }
        });

        strictEqual(input.getType(), attributeValue,
            "should forward value returned by htmlAttributes");
    });

    test("Input value setter", function () {
        expect(3);

        var input = $basicWidgets.Input.create('text');

        input.addMocks({
            addAttribute: function (attrName, attrValue) {
                equal(attrName, 'value', "should set value attribute");
                equal(attrValue, 'foo', "should set specified value");
            }
        });

        strictEqual(input.setValue('foo'), input, "should be chainable");
    });

    test("Input value removal", function () {
        expect(2);

        var input = $basicWidgets.Input.create('text');

        input.addMocks({
            removeAttribute: function (attrName) {
                equal(attrName, 'value', "should remove value attribute");
            }
        });

        strictEqual(input.clearValue(), input, "should be chainable");
    });

    test("Input value getter", function () {
        expect(2);

        var input = $basicWidgets.Input.create('text'),
            attributeValue = {};

        input.htmlAttributes.addMocks({
            getItem: function (key) {
                equal(key, 'value', "should get value attribute");
                return attributeValue;
            }
        });

        strictEqual(input.getValue(), attributeValue,
            "should forward value returned by htmlAttributes");
    });

    test("Input name setter", function () {
        expect(3);

        var input = $basicWidgets.Input.create('text');

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            }
        });

        strictEqual(input.setName('foo'), input, "should be chainable");
        equal(input.htmlAttributes.getItem('name'), 'foo', "should set name attribute");
    });

    test("Input name removal", function () {
        expect(3);

        var input = $basicWidgets.Input.create('text');

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            },

            removeAttribute: function (attrName) {
                equal(attrName, 'name', "should remove name attribute");
            }
        });

        strictEqual(input.clearName(), input, "should be chainable");
    });

    test("Input name getter", function () {
        var input = $basicWidgets.Input.create('text')
            .setName('foo');

        equal(input.getName(), 'foo', "should return name attribute");
    });

    test("Focusing", function () {
        expect(2);

        var input = $basicWidgets.Input.create('text'),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _focusProxy: function (element) {
                strictEqual(element, inputElement, "should invoke focus proxy on input element");
            }
        });

        strictEqual(input.focus(), input, "should be chainable");
    });

    test("Blurring", function () {
        expect(2);

        var input = $basicWidgets.Input.create('text'),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _blurProxy: function (element) {
                strictEqual(element, inputElement, "should invoke blur proxy on input element");
            }
        });

        strictEqual(input.blur(), input, "should be chainable");
    });

    test("Focus getter", function () {
        var input = $basicWidgets.Input.create('text'),
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
