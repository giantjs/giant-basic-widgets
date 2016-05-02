(function () {
    "use strict";

    module("Optionable");

    var Optionable = $widget.Widget.extend('Optionable')
        .addTrait($basicWidgets.BinaryStateful)
        .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
        .addTraitAndExtend($basicWidgets.Optionable)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Optionable.init.call(this);
            },

            afterRender: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.Optionable.afterRender.call(this);
            },

            afterStateOn: function () {
                $basicWidgets.Disableable.afterStateOn.call(this);
                $basicWidgets.Optionable.afterStateOn.call(this);
            },

            afterStateOff: function () {
                $basicWidgets.Disableable.afterStateOff.call(this);
                $basicWidgets.Optionable.afterStateOff.call(this);
            }
        });

    test("Instantiation", function () {
        var option = Optionable.create();

        equal(option.tagName, 'option', "should set tagName property");
    });

    test("Disabling", function () {
        var option = Optionable.create();

        option.disableBy('foo');

        ok(option.htmlAttributes.getItem('disabled'), "should set disabled attribute");
    });

    test("Enabling", function () {
        var option = Optionable.create()
            .disableBy('foo');

        option.enableBy('foo');

        ok(!option.htmlAttributes.getItem('disabled'), "should reset disabled attribute");
    });

    test("Option value getter", function () {
        var option = Optionable.create();

        option.addAttribute('value', 'foo');

        equal(option.getOptionValue(), 'foo', "should retrieve value attribute");
    });

    test("Option value setter", function () {
        expect(5);

        var option = Optionable.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.payload.beforeValue, undefined, "should set beforeValue payload");
            equal(event.payload.afterValue, 'foo', "should set afterValue payload");
        }

        option.subscribeTo($basicWidgets.EVENT_OPTION_VALUE_CHANGE, onValueChange);

        strictEqual(option.setOptionValue('foo'), option, "should be chainable");
        equal(option.getOptionValue(), 'foo', "should set option value attribute");

        // should not trigger any further events when setting same value
        option.setOptionValue('foo');

        option.removeMocks();
        option.unsubscribeFrom($basicWidgets.EVENT_OPTION_VALUE_CHANGE, onValueChange);
    });

    // TODO: Extend with events
    test("Selecting option", function () {
        expect(5);

        var option = Optionable.create(),
            select = $basicWidgets.Select.create();

        throws(function () {
            option.select();
        }, "should throw exception when not added to select");

        select.addItemWidget(option);

        function onSelectedChange(event) {
            ok(!event.payload.wasSelected, "should set wasSelected payload");
            ok(event.payload.isSelected, "should set isSelected payload");
        }

        option.subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);

        strictEqual(option.select(), option, "should be chainable");
        ok(option.selected, "should add selected attribute");

        option.unsubscribeFrom($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);
    });

    // TODO: Extend with events
    test("Deselecting option", function () {
        var option = Optionable.create(),
            select = $basicWidgets.Select.create();

        throws(function () {
            option.deselect();
        }, "should throw exception when not added to select");

        select.addItemWidget(option);
        option.select();

        function onSelectedChange(event) {
            ok(event.payload.wasSelected, "should set wasSelected payload");
            ok(!event.payload.isSelected, "should set isSelected payload");
        }

        option.subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);

        option.select();

        strictEqual(option.deselect(), option, "should be chainable");
        ok(!option.selected, "should remove selected attribute");

        option.unsubscribeFrom($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);
    });
}());
