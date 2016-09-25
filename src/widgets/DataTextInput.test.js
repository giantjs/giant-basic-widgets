(function () {
    "use strict";

    module("DataTextInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataTextInput.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataTextInput.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var input = $basicWidgets.DataTextInput.create(
            'text',
            'input/1/value'.toFieldKey(),
            'input/1/name'.toFieldKey());

        ok(input.valueKey.equals('input/1/value'.toFieldKey()),
            "should set valueKey property");
        ok(input.nameKey.equals('input/1/name'.toFieldKey()),
            "should set nameKey property");
    });

    test("Input state handler", function () {
        expect(1);

        var input = $basicWidgets.DataTextInput.create('text', 'input/1/value'.toFieldKey())
            .setName('foo');

        input.afterAdd();

        input.addMocks({
            _syncEntityToInputValue: function () {
                ok(true, "should sync entity to input value");
            }
        });

        input.setValue('bar');

        input.afterRemove();
    });
}());
