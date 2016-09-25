(function () {
    "use strict";

    module("EntityInput");

    var EntityInput = $basicWidgets.TextInput.extend('EntityInput')
        .addTraitAndExtend($entity.EntityBound)
        .addTraitAndExtend($basicWidgets.EntityInput)
        .addMethods({
            init: function (valueKey, nameKey) {
                $basicWidgets.TextInput.init.call(this, 'text');
                $entity.EntityBound.init.call(this);
                $basicWidgets.EntityInput.init.call(this, valueKey, nameKey);
            },
            afterAdd: function () {
                $basicWidgets.TextInput.afterAdd.call(this);
                $basicWidgets.EntityInput.afterAdd.call(this);
            },
            afterRemove: function () {
                $basicWidgets.TextInput.afterRemove.call(this);
                $basicWidgets.EntityInput.afterRemove.call(this);
            }
        });

    test("Value change handler", function () {
        expect(1);

        var input = EntityInput.create('input/1/value'.toFieldKey());

        'input/1'.toDocument().unsetNode();

        input.afterAdd();

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to entity");
            }
        });

        'input/1/value'.toField().setValue('bar');

        input.afterRemove();
    });

    test("Name change handler", function () {
        expect(1);

        var input = EntityInput.create('input/1/value'.toFieldKey(), 'input/1/name'.toFieldKey());

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
