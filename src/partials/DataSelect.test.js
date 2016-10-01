(function () {
    "use strict";

    module("DataSelect");

    var DataSelect = $widget.Widget.extend('DataSelect')
        .addTraitAndExtend($basicWidgets.DataSelect)
        .addMethods({
            init: function (selectedKey) {
                $widget.Widget.init.call(this);
                $basicWidgets.DataSelect.init.call(this, selectedKey);
            },

            afterAdd: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.DataSelect.afterAdd.call(this);
            }
        });

    test("Instantiation", function () {
        var select = DataSelect.create('foo/1/bar'.toFieldKey());
        ok('foo/1/bar'.toFieldKey().equals(select.selectedKey), "should set selectedKey property");
    });

    test("Item widget spawner", function () {
        var select = DataSelect.create('foo/1/bar'.toFieldKey()),
            itemWidget = select.spawnItemWidget('foo/1/baz/0'.toItemKey());

        ok(itemWidget.isA($basicWidgets.DataOption), "should return DataOption instance");
        equal(itemWidget.getOptionValue(), '0', "should set Option value");
    });

    test("Item name spawner", function () {
        var select = DataSelect.create('foo/1/bar'.toFieldKey()),
            itemName = select.spawnItemName('foo/1/baz/0'.toItemKey());

        equal(itemName, '0', "should return item ID");
    });

    test("Selection change handler", function (assert) {
        expect(1);

        var done = assert.async(),
            select = DataSelect.create('foo/1/bar'.toFieldKey())
                .addToParent($basicWidgets.Application.create());

        $entity.Field.addMocks({
            setValue: function (value) {
                if (this.entityKey.equals('foo/1/bar'.toFieldKey())) {
                    equal(value, 'hello', "should set value in selected field");
                }

                $entity.Field.removeMocks();
                select.removeFromParent();
                done();
            }
        });

        select.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
            .setPayloadItems({
                afterValues: 'hello'
            })
            .triggerSync();
    });
}());
