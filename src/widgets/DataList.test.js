(function () {
    "use strict";

    module("DataList");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataList.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataList.create('foo');
        }, "should raise exception on invalid arguments");

        throws(function () {
            $basicWidgets.DataList.create('input/dataListTest/name'.toFieldKey());
        }, "should raise exception on invalid field type");

        var dataList = $basicWidgets.DataList.create('form/dataListTest/inputs'.toFieldKey());

        ok(dataList.itemIdToChildName.isA($data.Collection),
            "should set itemRefToChildName property");
    });

    test("Default item widget spawner", function () {
        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            itemKey = fieldKey.getItemKey('foo'),
            dataList = $basicWidgets.DataList.create(fieldKey),
            itemWidget;

        itemWidget = dataList.spawnItemWidget(itemKey);

        ok(itemWidget.isA($basicWidgets.DataText), "should return DataText instance");
        equal(itemWidget.childName, dataList.spawnItemName(itemKey),
            "should set childName property on item widget");
    });

    test("Default item name spawner", function () {
        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            itemKey = fieldKey.getItemKey('foo'),
            dataList = $basicWidgets.DataList.create(fieldKey);

        equal(dataList.spawnItemName(itemKey), 'foo',
            "should return item ID");
    });

    test("Item widget updating", function () {
        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            dataList = $basicWidgets.DataList.create(fieldKey),
            removedChildNames = [],
            addedChildNames = [];

        fieldKey.toField()
            .setNode({
                'foo': true,
                'bar': true
            });

        $widget.Widget.addMocks({
            removeFromParent: function () {
                removedChildNames.push(this.childName);
                return this;
            }
        });

        dataList.addMocks({
            addItemWidget: function (itemWidget) {
                addedChildNames.push(itemWidget.childName);
                return this;
            }
        });

        dataList._updateItemWidgets();

        $widget.Widget.removeMocks();

        deepEqual(dataList.itemIdToChildName.items, {
            "foo": "foo",
            "bar": "bar"
        }, "should set itemIdToChildName property");

        deepEqual(addedChildNames, [
            "foo",
            "bar"
        ], "should add new item widgets");

        deepEqual(removedChildNames, [], "should remove old item widgets");
    });

    test("Item widget getter by item key", function () {
        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            dataList = $basicWidgets.DataList.create(fieldKey);

        fieldKey.toField()
            .setNode({
                'foo': true,
                'bar': true
            });

        dataList.afterAdd();

        equal(dataList.getItemWidgetByKey(fieldKey.getItemKey('baz')), undefined,
            "should return undefined for absent item ID");

        var itemKey = fieldKey.getItemKey('foo'),
            itemWidget = dataList.getItemWidgetByKey(itemKey);

        ok(itemWidget.isA($widget.Widget), "should return Widget instance");
        equal(itemWidget.childName, 'foo', "should return correct widget");

        dataList.afterRemove();
    });

    test("Collection change handler", function () {
        expect(1);

        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            dataList = $basicWidgets.DataList.create(fieldKey);

        fieldKey.toField()
            .setNode({
                'foo': true
            });

        dataList.afterAdd();

        dataList.addMocks({
            _updateItemWidgets: function () {
                ok(true, "should update item widgets");
            }
        });

        fieldKey.toField().getItem('bar').setValue(true);

        dataList.removeMocks();

        dataList.afterRemove();
    });
}());
