(function () {
    "use strict";

    module("Option");

    test("Instantiation", function () {
        var option = $basicWidgets.Option.create();

        equal(option.tagName, 'option', "should set tagName property");
    });

    test("Disabling", function () {
        var option = $basicWidgets.Option.create();

        option.disableBy('foo');

        ok(option.htmlAttributes.getItem('disabled'), "should set disabled attribute");
    });

    test("Enabling", function () {
        var option = $basicWidgets.Option.create()
            .disableBy('foo');

        option.enableBy('foo');

        ok(!option.htmlAttributes.getItem('disabled'), "should reset disabled attribute");
    });

    test("Option value getter", function () {
        var option = $basicWidgets.Option.create();

        option.addAttribute('value', 'foo');

        equal(option.getOptionValue(), 'foo', "should retrieve value attribute");
    });

    test("Option value setter", function () {
        expect(5);

        var option = $basicWidgets.Option.create();

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

        var option = $basicWidgets.Option.create(),
            select = $basicWidgets.Select.create();

        throws(function () {
            option.selectOption();
        }, "should throw exception when not added to select");

        select.addItemWidget(option);

        function onSelectedChange(event) {
            ok(!event.payload.wasSelected, "should set wasSelected payload");
            ok(event.payload.isSelected, "should set isSelected payload");
        }

        option.subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);

        strictEqual(option.selectOption(), option, "should be chainable");
        ok(option.isSelected, "should add selected attribute");

        option.unsubscribeFrom($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);
    });

    // TODO: Extend with events
    test("Deselecting option", function () {
        var option = $basicWidgets.Option.create(),
            select = $basicWidgets.Select.create();

        throws(function () {
            option.deselectOption();
        }, "should throw exception when not added to select");

        select.addItemWidget(option);
        option.selectOption();

        function onSelectedChange(event) {
            ok(event.payload.wasSelected, "should set wasSelected payload");
            ok(!event.payload.isSelected, "should set isSelected payload");
        }

        option.subscribeTo($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);

        option.selectOption();

        strictEqual(option.deselectOption(), option, "should be chainable");
        ok(!option.isSelected, "should remove selected attribute");

        option.unsubscribeFrom($basicWidgets.EVENT_OPTION_SELECTED_CHANGE, onSelectedChange);
    });
}());
