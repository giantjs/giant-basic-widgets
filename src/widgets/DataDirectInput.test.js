(function () {
    "use strict";

    module("DataDirectInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataDirectInput.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataDirectInput.create('foo');
        }, "should raise exception on invalid arguments");

        var input = $basicWidgets.DataDirectInput.create(
            'input/1'.toDocumentKey(),
            'form/1/values'.toFieldKey());

        ok(input.entityKey.equals('input/1'.toDocumentKey()),
            "should set entityKey property");
        ok(input.formValuesKey.equals('form/1/values'.toFieldKey()),
            "should set formValuesKey property");
    });

    test("Input name setter", function () {
        expect(4);

        var input = $basicWidgets.DataDirectInput.create(
            'input/1'.toDocumentKey(),
            'form/1/values'.toFieldKey());

        $basicWidgets.DirectInput.addMocks({
            setInputName: function (inputName) {
                strictEqual(this, input, "should set input name on input");
                equal(inputName, 'foo', "should pass input name to setter");
            }
        });

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to value entity");
            }
        });

        strictEqual(input.setInputName('foo'), input, "should be chainable");

        $basicWidgets.DirectInput.removeMocks();
    });

    test("Input name removal", function () {
        expect(3);

        var input = $basicWidgets.DataDirectInput.create(
            'input/1'.toDocumentKey(),
            'form/1/values'.toFieldKey());

        $basicWidgets.DirectInput.addMocks({
            clearInputName: function () {
                strictEqual(this, input, "should clear input name on input");
            }
        });

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to value entity");
            }
        });

        strictEqual(input.clearInputName(), input, "should be chainable");

        $basicWidgets.DirectInput.removeMocks();
    });

    test("Input state change handler", function () {
        expect(1);

        var input = $basicWidgets.DataDirectInput.create(
            'input/1'.toDocumentKey(),
            'form/1/values'.toFieldKey());

        input.afterAdd();

        input.addMocks({
            _syncEntityToInputValue: function () {
                ok(true, "should sync entity to input value");
            }
        });

        input.setInputValue('bar');

        input.afterRemove();
    });

    test("Form values change handler", function () {
        expect(1);

        var input = $basicWidgets.DataDirectInput.create(
            'input/1'.toDocumentKey(),
            'form/1/values'.toFieldKey());

        input.afterAdd();

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to entity");
            }
        });

        'form/1/values'.toField().setValue({
            foo: 'bar',
            baz: 'quux'
        });

        input.afterRemove();
    });

    test("Name field change handler", function () {
        expect(1);

        var input = $basicWidgets.DataDirectInput.create(
            'input/1'.toDocumentKey(),
            'form/1/values'.toFieldKey());

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
