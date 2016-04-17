(function () {
    "use strict";

    module("Select");

    test("Instantiation", function () {
        var select = $basicWidgets.Select.create();

        ok(select.optionWidgetsByValue.isA($data.Collection), "should add optionWidgetsByValue property");
        ok(select.selectedValues.isA($data.Collection), "should add selectedValues property");
        equal(select.tagName, 'select', "should set tagName property");
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
            getElement: function () {
                return element;
            },

            _valueGetterProxy: function () {
                return 'foo';
            }
        });

        option.addMocks({
            selectOption: function () {
                ok(true, "should select matching option widget");
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

    test("Option selected state change handler", function () {
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
            deepEqual(event.payload.beforeValues, {},
                "should send before values to event");
            deepEqual(event.payload.afterValues, {
                foo: 'foo'
            }, "should send before values to event");
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionCahnge);

        option1.selectOption();

        select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionCahnge);

        select.removeFromParent();
    });
}());
