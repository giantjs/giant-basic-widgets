(function () {
    "use strict";

    module("EntityInput");

    var EntityInput = $basicWidgets.DirectInput.extend('EntityInput')
        .addTrait($basicWidgets.EntityWidget)
        .addTraitAndExtend($basicWidgets.EntityInput)
        .addMethods({
            init: function (inputKey) {
                $basicWidgets.DirectInput.init.call(this);
                $basicWidgets.EntityWidget.init.call(this, inputKey);
            },
            afterAdd: function () {
                $basicWidgets.DirectInput.afterAdd.call(this);
                $basicWidgets.EntityInput.afterAdd.call(this);
            },
            afterRemove: function () {
                $basicWidgets.DirectInput.afterRemove.call(this);
                $basicWidgets.EntityInput.afterRemove.call(this);
            }
        });

    test("Value change handler", function () {
        expect(1);

        var input = EntityInput.create('input/1'.toDocumentKey());

        'input/1'.toDocument().unsetNode();

        input.afterAdd();

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to entity");
            }
        });

        'input/1'.toDocument().setValue('bar');

        input.afterRemove();
    });

    test("Name change handler", function () {
        expect(1);

        var input = EntityInput.create('input/1'.toDocumentKey());

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

    test("Validity change handler", function () {
        expect(1);

        var input = EntityInput.create('input/1'.toDocumentKey());

        'input/1'.toDocument().setNode({
            _reasons: ['foo']
        });

        input.afterAdd();

        input.addMocks({
            _syncValidityToEntity: function () {
                ok(true, "should sync validity to entity");
            }
        });

        'input/1/_reasons'.toField().setValue([]);

        input.afterRemove();
    });
}());
