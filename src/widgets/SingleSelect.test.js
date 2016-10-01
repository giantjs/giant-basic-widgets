(function () {
    "use strict";

    module("SingleSelect");

    test("Instantiation", function () {
        var select = $basicWidgets.SingleSelect.create();

        ok(select.hasOwnProperty('selectedValue'), "should add selectedValue property");
    });

    test("Value setter", function () {
        expect(2);

        var select = $basicWidgets.SingleSelect.create()
            .addItemWidget($basicWidgets.Option.create()
                .setOptionValue('foo'))
            .addItemWidget($basicWidgets.Option.create()
                .setOptionValue('bar'));

        $basicWidgets.Option.addMocks({
            select: function () {
                equal(this.getOptionValue(), 'foo', "should select corresponding option");
            }
        });

        strictEqual(select.setValue('foo'), select, "should be chainable");

        $basicWidgets.Option.removeMocks();
    });

    test("Value getter", function () {
        var select = $basicWidgets.SingleSelect.create();

        select.selectedValue = 'bar';

        equal(select.getValue(), 'bar', "should return selected value");
    });

    test("DOM change handler", function () {
        expect(1);

        var element = {},
            option = $basicWidgets.Option.create()
                .setOptionValue('foo'),
            select = $basicWidgets.SingleSelect.create()
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
            select: function () {
                equal(this.getOptionValue(), 'foo', "should select matching option widget");
            }
        });

        select.onChange({});
    });

    test("Option value change handler", function (assert) {
        expect(4);

        var done = assert.async(),
            option1 = $basicWidgets.Option.create()
                .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = $basicWidgets.SingleSelect.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        option2.select();

        function onSelectionChange(event) {
            ok(true, "should trigger event about change");
            equal(event.payload.beforeValues, undefined, "should send before values to event");
            equal(event.payload.afterValues, 'baz', "should send after values to event");

            // cleaning up
            select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);
            select.removeFromParent();

            done();
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);

        option2.setOptionValue('baz');

        throws(function () {
            option2.setOptionValue('foo');
        }, "should throw exception on existing target value");
    });

    test("Option selected change handler", function (assert) {
        expect(3);

        var done = assert.async(),
            option1 = $basicWidgets.Option.create()
                .setOptionValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setOptionValue('bar'),
            select = $basicWidgets.SingleSelect.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        function onSelectionChange(event) {
            ok(true, "should trigger event about change");
            equal(event.payload.beforeValues, undefined, "should send before values to event");
            equal(event.payload.afterValues, 'bar', "should send after values to event");

            // cleaning up
            select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);
            select.removeFromParent();

            done();
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);

        option1.select();
        option2.select();
    });
}());
