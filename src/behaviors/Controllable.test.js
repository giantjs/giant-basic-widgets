(function () {
    "use strict";

    module("Controllable");

    var Controllable = $widget.Widget.extend('Controllable')
        .addTraitAndExtend($basicWidgets.BinaryStateful)
        .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
        .addTraitAndExtend($basicWidgets.Controllable, 'Controllable')
        .addMethods({
            init           : function (inputType) {
                $widget.Widget.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
            },
            afterAdd       : function () {
                $widget.Widget.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.Controllable.afterAdd.call(this);
            },
            afterRemove    : function () {
                $widget.Widget.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },
            afterStateOn   : function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.Controllable.afterStateOn.call(this, stateName);
            },
            afterStateOff  : function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.Controllable.afterStateOff.call(this, stateName);
            },
            addAttribute   : function (attributeName, attributeValue) {
                $widget.Widget.addAttribute.call(this, attributeName, attributeValue);
                $basicWidgets.Controllable.addAttribute.call(this, attributeName, attributeValue);
                return this;
            },
            removeAttribute: function (attributeName) {
                $widget.Widget.removeAttribute.call(this, attributeName);
                $basicWidgets.Controllable.removeAttribute.call(this, attributeName);
                return this;
            }
        });

    test("State-on handler override", function () {
        expect(1);

        var input = Controllable.create('text');

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.disableBy('foo');
    });

    test("State-off handler override", function () {
        expect(1);

        var input = Controllable.create('text')
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

        var input = Controllable.create('text'),
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

        var input = Controllable.create('text'),
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
        var input = Controllable.create('text'),
            label = $basicWidgets.Text.create();

        strictEqual(input.linkLabelWidget(label), input, "should be chainable");
        equal(label.tagName, 'label', "should change label tagName property to 'label'");
        equal(label.htmlAttributes.getItem('for'), input.htmlAttributes.idAttribute,
            "should set 'for' attribute to input ID");
    });

    test("Controllable value setter", function () {
        expect(3);

        var input = Controllable.create('text');

        input.addMocks({
            addAttribute: function (attrName, attrValue) {
                equal(attrName, 'value', "should set value attribute");
                equal(attrValue, 'foo', "should set specified value");
            }
        });

        strictEqual(input.setValue('foo'), input, "should be chainable");
    });

    test("Controllable value removal", function () {
        expect(2);

        var input = Controllable.create('text');

        input.addMocks({
            removeAttribute: function (attrName) {
                equal(attrName, 'value', "should remove value attribute");
            }
        });

        strictEqual(input.clearValue(), input, "should be chainable");
    });

    test("Controllable value getter", function () {
        expect(2);

        var input = Controllable.create('text'),
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

    test("Controllable name setter", function () {
        expect(3);

        var input = Controllable.create('text');

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            }
        });

        strictEqual(input.setName('foo'), input, "should be chainable");
        equal(input.htmlAttributes.getItem('name'), 'foo', "should set name attribute");
    });

    test("Controllable name removal", function () {
        expect(3);

        var input = Controllable.create('text');

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

    test("Controllable name getter", function () {
        var input = Controllable.create('text')
            .setName('foo');

        equal(input.getName(), 'foo', "should return name attribute");
    });
}());
