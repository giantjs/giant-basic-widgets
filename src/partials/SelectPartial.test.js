(function () {
    "use strict";

    module("SelectPartial");

    var SelectPartial = $basicWidgets.List.extend('SelectPartial')
        .addTrait($basicWidgets.SelectPartial)
        .addMethods({
            init: function () {
                $basicWidgets.List.init.call(this);
                $basicWidgets.SelectPartial.init.call(this);
            }
        });

    test("Instantiation", function () {
        var select = SelectPartial.create();

        ok(select.optionWidgetsByValue.isA($data.Collection), "should add optionWidgetsByValue property");
        equal(select.tagName, 'select', "should set tagName property");
    });

    test("Item widget addition", function () {
        var select = SelectPartial.create();

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

    test("Item widget removal", function () {
        var option = $basicWidgets.Option.create()
            .setOptionValue('foo'),
            select = SelectPartial.create();

        strictEqual(select.removeItemWidget(option), select, "should be chainable");
        deepEqual(select.optionWidgetsByValue.items, {}, "should remove item widget from lookup");
    });

    test("Option widget getter", function () {
        var option1 = $basicWidgets.Option.create()
            .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = SelectPartial.create()
                .addItemWidget(option1)
                .addItemWidget(option2);

        strictEqual(select.getOptionWidgetByValue('bar'), option2,
            "should return option instance with specified value");
    });
}());
