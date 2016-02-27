(function () {
    "use strict";

    module("DataDirectInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataDirectInput.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataDirectInput.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var input = $basicWidgets.DataDirectInput.create(
            'text',
            'input/1'.toDocumentKey());

        ok(input.entityKey.equals('input/1'.toDocumentKey()),
            "should set entityKey property");
    });

    test("Input state handler", function () {
        expect(1);

        var input = $basicWidgets.DataDirectInput.create('text', 'input/1'.toDocumentKey());

        input.afterAdd();

        input.addMocks({
            _syncEntityToInputValue: function () {
                ok(true, "should sync entity to input value");
            }
        });

        input.setInputValue('bar');

        input.afterRemove();
    });

    test("Value change handler", function () {
        expect(1);

        var input = $basicWidgets.DataDirectInput.create('text', 'input/1'.toDocumentKey());

        'input/1'.toDocument().unsetNode();

        input.afterAdd();

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to entity");
            }
        });

        'input/1'.toDocument().setInputValue('bar');

        input.afterRemove();
    });

    test("Name change handler", function () {
        expect(1);

        var input = $basicWidgets.DataDirectInput.create('text', 'input/1'.toDocumentKey());

        'input/1'.toDocument().unsetNode();

        input.afterAdd();

        input.addMocks({
            _syncInputNameToEntity: function () {
                ok(true, "should sync input name to entity");
            }
        });

        'input/1/name'.toField().setValue('foo');

        input.afterRemove();
    });
}());
