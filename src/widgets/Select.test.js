(function () {
    "use strict";

    module("Select");

    test("Instantiation", function () {
        var select = $basicWidgets.Select.create();

        ok(select.optionWidgetsByValue.isA($data.Collection), "should add optionWidgetsByValue property");
        ok(select.selectedValues.isA($data.Collection), "should add selectedValues property");
        equal(select.tagName, 'select', "should set tagName property");
        equal(select.allowsMultipleOptions, false, "should set allowsMultipleOption to false");
    });

    test("Item widget addition", function () {
        var select = $basicWidgets.Select.create();

        throws(function () {
            select.addItemWidget();
        }, "should throw exception on missing option argument");

        throws(function () {
            select.addItemWidget($widget.Widget.create());
        }, "should throw exception on invalid option argument");

        var option = $basicWidgets.Option.create()
            .setOptionValue('foo');

        strictEqual(select.addItemWidget(option), select, "should be chainable");
        deepEqual(select.optionWidgetsByValue.items, {
            foo: option
        }, "should add item widget to lookup");

        throws(function () {
            select.addItemWidget($basicWidgets.Option.create()
                .setOptionValue('foo'));
        }, "should throw exception on adding duplicate");
    });

    test("Switching multiple on", function () {
        var select = $basicWidgets.Select.create();

        select.addMocks({
            _updateMultiplicity: function () {
                ok(true, "should update multiplicity");
            }
        });

        strictEqual(select.allowMultipleSelected(), select, "should be chainable");
        equal(select.allowsMultipleOptions, true, "should set allowsMultipleOptions flag");
    });

    test("Switching multiple off", function () {
        var select = $basicWidgets.Select.create();

        select.addMocks({
            _updateMultiplicity: function () {
                ok(true, "should update multiplicity");
            }
        });

        strictEqual(select.allowSingleSelectedOnly(), select, "should be chainable");
        equal(select.allowsMultipleOptions, false, "should unset allowsMultipleOptions flag");
    });

    test("Option widget getter", function () {
        var option1 = $basicWidgets.Option.create()
            .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = $basicWidgets.Select.create()
                .addItemWidget(option1)
                .addItemWidget(option2);

        strictEqual(select.getOptionWidgetByValue('bar'), option2,
            "should return option instance with specified value");
    });

    test("DOM change handler", function () {
        expect(1);

        var element = {},
            option = $basicWidgets.Option.create()
                .setOptionValue('foo'),
            select = $basicWidgets.Select.create()
                .addItemWidget(option);

        select.addMocks({
            _selectedOptionsGetterProxy: function () {
                return [element];
            },

            _valueGetterProxy: function () {
                return 'foo';
            }
        });

        option.addMocks({
            selectOption: function () {
                equal(this.getOptionValue(), 'foo', "should select matching option widget");
            }
        });

        select.onChange({});
    });

    test("Option value change handler", function () {
        var option1 = $basicWidgets.Option.create()
            .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = $basicWidgets.Select.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        option1.selectOption();

        option1.setOptionValue('baz');

        deepEqual(select.optionWidgetsByValue.items, {
            bar: option2,
            baz: option1
        }, "should move option widget in lookup");

        deepEqual(select.selectedValues.items, {
            baz: 'baz'
        }, "should change selected values when affected option is selected");

        throws(function () {
            option1.setOptionValue('bar');
        }, "should throw exception on existing target value");

        select.removeFromParent();
    });

    test("Single option selected state change handler", function () {
        expect(3);

        var option1 = $basicWidgets.Option.create()
            .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = $basicWidgets.Select.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        function onSelectionCahnge(event) {
            ok(true, "should trigger event about change");
            deepEqual(event.payload.beforeValues, {
                foo: 'foo'
            }, "should send before values to event");
            deepEqual(event.payload.afterValues, {
                bar: 'bar'
            }, "should send before values to event");
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionCahnge);

        option2.selectOption();

        select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionCahnge);

        select.removeFromParent();
    });

    test("Multiple option selected state change handler", function () {
        expect(3);

        var option1 = $basicWidgets.Option.create()
            .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = $basicWidgets.Select.create()
                .allowMultipleSelected()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        function onSelectionCahnge(event) {
            ok(true, "should trigger event about change");
            deepEqual(event.payload.beforeValues, {
                foo: 'foo'
            }, "should send before values to event");
            deepEqual(event.payload.afterValues, {
                foo: 'foo',
                bar: 'bar'
            }, "should send before values to event");
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionCahnge);

        option2.selectOption();

        select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionCahnge);

        select.removeFromParent();
    });
}());
